import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from lightgbm import LGBMClassifier
from sklearn.metrics import accuracy_score, classification_report
from data_pipeline.clean import clean_data
from data_pipeline.features import preprocess_features

def evaluate_models():
    df = clean_data('WA_Fn-UseC_-Telco-Customer-Churn.csv')
    df, _ = preprocess_features(df)
    X = df.drop(columns=['Churn'], axis=1)
    y = df['Churn']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=44)
    
    # Model 1: Baseline (Logistic Regression)
    lr = LogisticRegression(max_iter=1000)
    lr.fit(X_train, y_train)
    lr_acc = accuracy_score(y_test, lr.predict(X_test))
    
    # Model 2: Advanced (LightGBM)
    lgb = LGBMClassifier()
    lgb.fit(X_train, y_train)
    lgb_acc = accuracy_score(y_test, lgb.predict(X_test))
    
    print(f"Logistic Regression Accuracy: {lr_acc:.4f}")
    print(f"LightGBM Accuracy: {lgb_acc:.4f}")
    return {"LogisticRegression": lr_acc, "LightGBM": lgb_acc}

if __name__ == "__main__":
    evaluate_models()
    