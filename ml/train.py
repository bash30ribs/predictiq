import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pandas as pd
from sklearn.model_selection import train_test_split
from lightgbm import LGBMClassifier
import joblib
from data_pipeline.clean import clean_data
from data_pipeline.features import preprocess_features

def train_and_save():
    df = clean_data('WA_Fn-UseC_-Telco-Customer-Churn.csv')
    df, scaler = preprocess_features(df)

    X = df.drop(columns=['Churn'])
    y = df['Churn']

    x_train, x_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=44)

    model = LGBMClassifier()
    model.fit(x_train, y_train)

    os.makedirs('ml/models', exist_ok=True)
    joblib.dump(model, 'ml/models/churn_model.pkl')
    joblib.dump(scaler, 'ml/models/scaler.pkl')
    print("Model and scaler trained and saved successfully inside ml/models/!")

if __name__ == "__main__":
    train_and_save()