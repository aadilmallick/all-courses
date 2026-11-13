"""Independent arithmetic checks of selected worked textbook answers.

These fixtures follow the stated assumptions and numbers in the narrative.
They complement implementation tests, not a proof of every mathematical claim.
"""
import json
import numpy as np
cases=[]
def check(chapter,name,value,expected,tolerance=1e-7):
    assert np.isclose(value,expected,rtol=tolerance,atol=tolerance),(chapter,name,value,expected)
    cases.append({'chapter':chapter,'calculation':name,'computed':float(value),'expected':float(expected)})
check(1,'Explicit row/column contraction',np.dot([1,2],[3,4]),11)
check(1,'Rank-one truncation residual',np.sqrt(2**2+1**2),np.sqrt(5))
check(2,'Shared scalar parameter paths',(1**2+3*1)*(2*1+3),20)
v=np.tanh(.5)
check(2,'Neuron forward loss',.5*(v-1)**2,.144659,1e-6)
check(2,'Neuron chain-rule gradient',(v-1)*(1-v*v)*2,-.846033,1e-6)
check(3,'Bayes posterior',.2*.8/(.2*.8+.8*.1),2/3)
check(3,'Bernoulli likelihood maximum',3/4,.75)
check(3,'Beta posterior mean',4/(4+2),2/3)
probability=np.exp([0,np.log(2),np.log(3)]);probability/=probability.sum()
check(3,'Three-class normalization',probability[2],.5)
check(3,'Geometric target probability',np.exp(np.mean(np.log([.9,.1]))),.3)
check(5,'Two-slot weighted read',.25*2+.75*10,8)
weights=np.exp([1/np.sqrt(2),0]);weights/=weights.sum()
check(5,'Scaled attention output coordinate 0',2*weights[0],1.3395230986533138)
check(5,'Scaled attention output coordinate 1',4*weights[1],1.3209538026933725)
check(6,'Rotary score at distance 1',np.cos(.2),.980067,1e-6)
check(6,'Rotary score at distance 2',np.cos(.4),.921061,1e-6)
check(7,'TinyGPT parameter count',2*5*8+5*8+12*8**2,888)
check(8,'KV cache in MiB',2*24*1*4*4096*64*2/(1024**2),96)
check(8,'Eight-example KV cache in MiB',2*24*8*4*4096*64*2/(1024**2),768)
check(9,'Rank-eight trainable factors',1024*8+8*1024,16384)
check(9,'Uniform reconstruction',np.round(.31/.2)*.2,.4)
check(11,'Three-step discounted return',1+.9*0+.9**2*2,2.62)
check(11,'Absorbing reward-one state value',1/(1-.9),10)
check(11,'Predecessor value',.9/(1-.9),9)
check(12,'Binary bandit exact gradient',.6*.5*(1-.5),.15)
check(12,'Two-step GAE at lambda .95',.16+.9*.95*.6,.673)
check(12,'Two-step GAE at lambda 1',.16+.9*.6,.7)
check(13,'All-equal Bernoulli reward group',.9**4+.1**4,.6562)
check(14,'RRF first/third document',1/61+1/63,.032266459536820194)
check(14,'RRF second/second document',2/62,.03225806451612903)
check(16,'Calibrated constant Brier loss',.7*(.3**2)+.3*(.7**2),.21)
check(17,'Patch-count ratio for half patch width',(28**2)/(14**2),4)
check(18,'Half-noise reconstruction amplification',np.sqrt((1-.5)/.5),1)
check(18,'Heavy-noise reconstruction amplification',np.sqrt((1-.01)/.01),9.9498743710662)
print(json.dumps({'passed':len(cases),'calculations':cases},indent=2))
