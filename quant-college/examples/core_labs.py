"""Offline teaching calculations. Python 3.12+, standard library only.

All generated market observations are synthetic. Run from any directory:
python examples/core_labs.py
"""
from __future__ import annotations
import csv, hashlib, json, math, random, statistics
from pathlib import Path

def mean(xs):
    if not xs: raise ValueError('Empty sample')
    return sum(xs)/len(xs)

def variance(xs):
    if len(xs)<2: raise ValueError('At least two observations required')
    m=mean(xs)
    return sum((x-m)**2 for x in xs)/(len(xs)-1)

def covariance(xs,ys):
    if len(xs)!=len(ys) or len(xs)<2: raise ValueError('Aligned samples required')
    mx,my=mean(xs),mean(ys)
    return sum((x-mx)*(y-my) for x,y in zip(xs,ys))/(len(xs)-1)

def returns(prices):
    if len(prices)<2 or any(not math.isfinite(p) or p<=0 for p in prices):
        raise ValueError('At least two finite positive prices required')
    return [b/a-1 for a,b in zip(prices[:-1],prices[1:])]

def wealth_path(rs):
    path=[1.0]
    for r in rs:
        if not math.isfinite(r) or r < -1: raise ValueError('Invalid unlevered return')
        path.append(path[-1]*(1+r))
    return path

def max_drawdown(path):
    if not path or path[0]<=0: raise ValueError('Positive initial wealth required')
    peak=path[0]; worst=0.0
    for x in path:
        peak=max(peak,x);worst=min(worst,x/peak-1)
    return -worst  # positive loss magnitude

def ols(x,y):
    if len(x)!=len(y) or len(x)<3: raise ValueError('At least three aligned pairs')
    vx=variance(x)
    if vx<=0: raise ValueError('Predictor has no variation')
    slope=covariance(x,y)/vx;intercept=mean(y)-slope*mean(x)
    residual=[b-intercept-slope*a for a,b in zip(x,y)]
    return {'intercept':intercept,'slope':slope,'residuals':residual}

def ewma_forecasts(rs,decay=0.94,initial_variance=0.0001):
    if not 0<=decay<1 or initial_variance<0: raise ValueError('Invalid variance setup')
    h=initial_variance;out=[]
    for r in rs:
        out.append(h)  # forecast is stored BEFORE seeing this return
        h=decay*h+(1-decay)*r*r
    return out

def normal_cdf(x): return 0.5*math.erfc(-x/math.sqrt(2))

def black_scholes(s,k,r,sigma,t,q=0.0):
    if not all(math.isfinite(x) for x in (s,k,r,sigma,t,q)) or s<=0 or k<=0 or sigma<0 or t<0:
        raise ValueError('Positive spot/strike; nonnegative volatility and maturity')
    if t==0: return {'call':max(s-k,0),'put':max(k-s,0),'delta':1.0 if s>k else 0.0 if s<k else 0.5}
    ds=s*math.exp(-q*t);dk=k*math.exp(-r*t)
    if sigma==0:
        return {'call':max(ds-dk,0),'put':max(dk-ds,0),'delta':math.exp(-q*t) if ds>dk else 0.0}
    d1=(math.log(s/k)+(r-q+sigma*sigma/2)*t)/(sigma*math.sqrt(t));d2=d1-sigma*math.sqrt(t)
    call=ds*normal_cdf(d1)-dk*normal_cdf(d2)
    return {'call':call,'put':call-ds+dk,'delta':math.exp(-q*t)*normal_cdf(d1)}

def monte_carlo_call(s=100,k=100,r=.05,sigma=.2,t=1,n_pairs=20000,seed=42):
    if n_pairs<2: raise ValueError('At least two independent pairs')
    rng=random.Random(seed); observations=[]
    for _ in range(n_pairs):
        z=rng.gauss(0,1)
        payoffs=[max(s*math.exp((r-sigma*sigma/2)*t+sigma*math.sqrt(t)*u)-k,0)*math.exp(-r*t) for u in (z,-z)]
        observations.append(mean(payoffs))
    return {'estimate':mean(observations),'standard_error':math.sqrt(variance(observations)/n_pairs),'independent_pairs':n_pairs}

def binomial_call(s=100,k=100,u=1.2,d=.9,gross=1.05):
    if not d<gross<u: raise ValueError('Tree violates strict no-arbitrage condition')
    cu,cd=max(s*u-k,0),max(s*d-k,0)
    delta=(cu-cd)/(s*(u-d));bond=(cd-delta*s*d)/gross
    probability=(gross-d)/(u-d)
    return {'price':delta*s+bond,'delta':delta,'cash':bond,'risk_neutral_probability':probability}

def scalar_kalman(observations,q=.04,r=1.0,initial_mean=0.0,initial_variance=1.0):
    if q<0 or r<=0 or initial_variance<0: raise ValueError('Invalid noise variances')
    m,p=initial_mean,initial_variance;out=[]
    for y in observations:
        p_minus=p+q;k=p_minus/(p_minus+r)
        m=m+k*(y-m);p=(1-k)**2*p_minus+k*k*r # Joseph scalar covariance
        out.append((m,p))
    return out

def project_reports():
    rng=random.Random(2026)
    prices=[100,105,102,108,106];rs=returns(prices);path=wealth_path(rs)
    market=[rng.gauss(0,.01) for _ in range(300)]
    asset=[.0003+1.2*x+rng.gauss(0,.004) for x in market]
    fit=ols(market,asset)
    # Synthetic event: exactly +2% added after a pre-event fit.
    event=240;asset[event]+=.02
    pre=ols(market[:200],asset[:200])
    ar=[asset[i]-pre['intercept']-pre['slope']*market[i] for i in range(event-1,event+2)]
    vol_returns=[rng.gauss(0,.005 if i<150 else .02) for i in range(300)]
    forecasts=ewma_forecasts(vol_returns)
    # Chronological regression target with independent future noise.
    feature=[rng.uniform(-1,1) for _ in range(300)]
    target=[.5+2*x+rng.gauss(0,.3) for x in feature]
    train=ols(feature[:200],target[:200]);test=list(zip(feature[240:],target[240:]))
    mse=mean([(y-train['intercept']-train['slope']*x)**2 for x,y in test])
    baseline=mean([(y-mean(target[:200]))**2 for x,y in test])
    return {
      'notice':'Synthetic fixtures demonstrate methods, not market performance.',
      'project_1':{'returns':rs,'final_wealth':path[-1],'max_drawdown_loss':max_drawdown(path)},
      'project_2':{'estimated_alpha':fit['intercept'],'estimated_beta':fit['slope'],'true_alpha':.0003,'true_beta':1.2},
      'project_3':{'event_index':event,'three_observation_CAR':sum(ar),'inserted_event_shock':.02,'note':'CAR also includes noise and fitted-benchmark error.'},
      'project_4':{'EWMA_MSE':mean([(a-b*b)**2 for a,b in zip(forecasts,vol_returns)]),'first_forecast':forecasts[0]},
      'project_5':{'test_MSE':mse,'baseline_test_MSE':baseline,'train_end_exclusive':200,'test_start':240},
      'project_6':{'closed_form':black_scholes(100,100,.05,.2,1),'monte_carlo':monte_carlo_call(),'tree':binomial_call()},
      'project_7':{'minimum_variance_weight_asset_1':(.01-.006)/(.04+.01-2*.006)},
    }

if __name__=='__main__':
    root=Path(__file__).resolve().parents[1]
    out=root/'outputs';out.mkdir(exist_ok=True)
    report=project_reports()
    (out/'synthetic-project-results.json').write_text(json.dumps(report,indent=2),encoding='utf8')
    print(json.dumps(report,indent=2))
