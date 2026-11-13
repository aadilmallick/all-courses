"""Model selection stays inside development data; final test is evaluated once."""
import json
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split,StratifiedKFold,GridSearchCV
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.dummy import DummyClassifier
from sklearn.metrics import accuracy_score,log_loss,roc_auc_score


def main():
    X,y=load_breast_cancer(return_X_y=True)
    dev,test=train_test_split(np.arange(len(y)),test_size=.25,stratify=y,random_state=27)
    cv=StratifiedKFold(4,shuffle=True,random_state=27)
    candidates=[
        ('constant',DummyClassifier(strategy='prior'),{}),
        ('logistic',make_pipeline(StandardScaler(),LogisticRegression(max_iter=2000)),{'logisticregression__C':[.1,1.,10.]}),
        ('forest',RandomForestClassifier(n_estimators=100,random_state=27,n_jobs=1),{'max_depth':[3,None],'min_samples_leaf':[1,5]})]
    records=[];best=None
    for name,model,grid in candidates:
        search=GridSearchCV(model,grid,scoring='neg_log_loss',cv=cv,n_jobs=1,refit=True)
        search.fit(X[dev],y[dev])
        records.append({'family':name,'development_neg_log_loss':float(search.best_score_),'parameters':search.best_params_})
        if best is None or search.best_score_>best[0]: best=(search.best_score_,name,search.best_estimator_)
    score,name,model=best
    probability=model.predict_proba(X[test])
    prediction=model.predict(X[test])
    result={'development':records,'selected':name,'test':{'accuracy':float(accuracy_score(y[test],prediction)),'log_loss':float(log_loss(y[test],probability)),'roc_auc':float(roc_auc_score(y[test],probability[:,1]))},'note':'Educational comparison on bundled data; not a clinical model.'}
    print(json.dumps(result,indent=2))


if __name__=='__main__': main()
