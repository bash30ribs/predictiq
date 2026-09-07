import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import joblib
import pandas as pd
from data_pipeline.clean import clean_data
from data_pipeline.features import preprocess_features

def explain_model():
    df = clean_data('WA_Fn-UseC_-Telco-Customer-Churn.csv')
    df, _ = preprocess_features(df)
    X = df.drop(columns=['Churn'])
    
    model = joblib.load('ml/models/churn_model.pkl')
    importances = model.feature_importances_
    
    total = importances.sum()
    norm_imp = importances / total if total > 0 else importances
    
    explanations = sorted(zip(X.columns, norm_imp), key=lambda x: x[1], reverse=True)
    print("Top Global Feature Importances:")
    for f, imp in explanations[:5]:
        print(f"  - {f}: {round(float(imp), 4)}")

if __name__ == "__main__":
    explain_model()