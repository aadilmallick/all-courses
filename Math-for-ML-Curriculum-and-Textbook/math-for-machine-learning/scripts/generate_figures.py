from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
root=Path(__file__).resolve().parents[1]
plt.rcParams.update({'font.size':11,'axes.spines.top':False,'axes.spines.right':False})
fig,ax=plt.subplots(figsize=(7,4.4))
u=np.array([3.,1.]);p=np.array([2.,2.])
ax.plot([-1,4],[-1,4],color='#087b69',label='Allowed line')
ax.annotate('',u,(0,0),arrowprops={'arrowstyle':'->','color':'#235fc5','lw':2})
ax.annotate('',p,(0,0),arrowprops={'arrowstyle':'->','color':'#087b69','lw':2})
ax.plot([p[0],u[0]],[p[1],u[1]],'--',color='#b63c46',label='Residual (1, −1)')
ax.text(3.02,1,'Target (3, 1)');ax.text(1.4,2.2,'Projection (2, 2)')
ax.set(xlim=(-.5,4),ylim=(-.5,3),xlabel='First coordinate',ylabel='Second coordinate',title='Projection separates a target into orthogonal components')
ax.set_aspect('equal');ax.grid(alpha=.2);ax.legend(loc='lower right');fig.tight_layout();fig.savefig(root/'assets/projection.png',dpi=180);plt.close(fig)
fig,axes=plt.subplots(1,2,figsize=(9,4))
x=np.linspace(-3,3,120);xx,yy=np.meshgrid(x,x)
axes[0].contour(xx,yy,.5*(xx**2+20*yy**2),levels=[.5,2,8,20,50],colors='#235fc5');axes[0].set(title='Unequal curvature',xlabel='Shallow coordinate',ylabel='Steep coordinate')
for step in [.05,.11]:
 q=np.array([4.,4.]);loss=[]
 for _ in range(30):loss.append(.5*(q[0]**2+20*q[1]**2));q-=step*np.array([q[0],20*q[1]])
 axes[1].semilogy(loss,label=f'Step {step}')
axes[1].set(title='Actual gradient descent losses',xlabel='Iteration',ylabel='Loss (log scale)');axes[1].legend();fig.tight_layout();fig.savefig(root/'assets/curvature.png',dpi=180);plt.close(fig)
fig,ax=plt.subplots(figsize=(7,4))
x=np.linspace(-4,4,500);ax.plot(x,np.exp(-x*x/2)/np.sqrt(2*np.pi),label='Standard normal')
t=np.linspace(0,4,300);ax.plot(t,np.exp(-t),label='Exponential, rate 1')
ax.set(title='Density height is probability per unit length',xlabel='Value',ylabel='Probability density');ax.legend();ax.grid(alpha=.2);fig.tight_layout();fig.savefig(root/'assets/densities.png',dpi=180);plt.close(fig)
(root/'requirements-figures.txt').write_text(f'matplotlib=={matplotlib.__version__}\nnumpy=={np.__version__}\n')
print('Generated 3 figures with Matplotlib',matplotlib.__version__)
