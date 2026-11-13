"""Independent known cases and mathematical invariants, standard unittest."""
import math,sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'examples'))
import core_labs as c

class CoreTests(unittest.TestCase):
 def test_cash_path_and_scale(self):
  p=[100,105,102,108,106];rs=c.returns(p)
  self.assertAlmostEqual(c.wealth_path(rs)[-1],1.06)
  self.assertAlmostEqual(c.max_drawdown(c.wealth_path(rs)),1-102/105)
  for a,b in zip(rs,c.returns([10*x for x in p])): self.assertAlmostEqual(a,b)
 def test_invalid_prices(self):
  for p in ([0,1],[1,float('nan')],[1]):
   with self.assertRaises(ValueError): c.returns(p)
 def test_hand_ols(self):
  fit=c.ols([0,1,2],[1,2,2])
  self.assertAlmostEqual(fit['slope'],.5);self.assertAlmostEqual(fit['intercept'],7/6)
  self.assertAlmostEqual(sum(fit['residuals']),0)
  self.assertAlmostEqual(sum(x*r for x,r in zip([0,1,2],fit['residuals'])),0)
 def test_no_future_leak(self):
  a=[.01,-.02,.03,.04];b=a.copy();b[3]=.9
  self.assertEqual(c.ewma_forecasts(a)[:4],c.ewma_forecasts(b)[:4])
 def test_call_known_value_and_parity(self):
  x=c.black_scholes(100,100,.05,.2,1)
  self.assertAlmostEqual(x['call'],10.450583572185565,places=9)
  self.assertAlmostEqual(x['call']-x['put'],100-100*math.exp(-.05))
  self.assertLess(x['call'],c.black_scholes(100,100,.05,.3,1)['call'])
  self.assertEqual(c.black_scholes(90,100,.05,.2,0)['call'],0)
  self.assertAlmostEqual(c.black_scholes(100,100,.05,0,1)['call'],100-100*math.exp(-.05))
 def test_tree_replication(self):
  x=c.binomial_call();self.assertAlmostEqual(x['price'],200/21)
  self.assertAlmostEqual(x['delta']*120+x['cash']*1.05,20)
  self.assertAlmostEqual(x['delta']*90+x['cash']*1.05,0)
 def test_antithetic_mc_sampling(self):
  x=c.monte_carlo_call(n_pairs=30000)
  self.assertLess(abs(x['estimate']-c.black_scholes(100,100,.05,.2,1)['call']),5*x['standard_error'])
 def test_kalman_known_update(self):
  m,p=c.scalar_kalman([13],q=0,r=5,initial_mean=10,initial_variance=4)[0]
  self.assertAlmostEqual(m,34/3);self.assertAlmostEqual(p,20/9)
 def test_covariance_bound(self):
  x=[1,2,4,8];y=[2,-1,3,0]
  self.assertLessEqual(c.covariance(x,y)**2,c.variance(x)*c.variance(y)+1e-12)

if __name__=='__main__': unittest.main(verbosity=2)
