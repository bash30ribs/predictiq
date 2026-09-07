import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import joblib
import pandas as pd
from data_pipeline.clean import clean_data
from data_pipeline.features import preprocess_features

def predict_single_customer(customer_index=0):
    df = clean_data('WA_Fn-UseC_-Telco-Customer-Churn.csv')
    
    raw_df = pd.read_csv('WA_Fn-UseC_-Telco-Customer-Churn.csv')
    cust_id = raw_df.loc[customer_index, 'customerID'] if 'customerID' in raw_df.columns else "C1024"
    
    df, scaler = preprocess_features(df)
    X = df.drop(columns=['Churn'])
    
    sample = X.iloc[[customer_index]]
    model = joblib.load('ml/models/churn_model.pkl')
    
    prob = float(model.predict_proba(sample)[0][1])
    pred = "Churn" if prob >= 0.5 else "No Churn"
    risk = "HIGH" if prob >= 0.7 else ("MEDIUM" if prob >= 0.4 else "LOW")
    confidence = "HIGH" if abs(prob - 0.5) > 0.3 else "MODERATE"
    
    # Normalize feature importances to a 0-1 scale
    importances = model.feature_importances_
    total_importance = importances.sum()
    normalized_importances = importances / total_importance if total_importance > 0 else importances
    
    features = X.columns
    explanations = sorted(zip(features, normalized_importances), key=lambda x: x[1], reverse=True)
    top_factors = [{"feature": f, "impact": round(float(imp), 2)} for f, imp in explanations[:1]]

    contract = {
        "customer_id": cust_id,
        "prediction": pred,
        "probability": round(prob, 2),
        "risk_level": risk,
        "confidence": confidence,
        "top_factors": top_factors
    }
    
    return contract

if __name__ == "__main__":
    result = predict_single_customer(0)
    import json
    print(json.dumps(result, indent=2))