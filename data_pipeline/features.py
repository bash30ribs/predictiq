import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder

def preprocess_features(df):
    categorical_columns = ['gender', 'SeniorCitizen', 'Partner', 'Dependents', 'PhoneService', 'MultipleLines',
                           'InternetService', 'OnlineSecurity', 'OnlineBackup', 'DeviceProtection', 'TechSupport',
                           'StreamingTV', 'StreamingMovies', 'Contract', 'PaperlessBilling', 'PaymentMethod']

    encoder = LabelEncoder()
    for col in categorical_columns:
        df[col] = encoder.fit_transform(df[col])

    numerical = ['tenure', 'MonthlyCharges', 'TotalCharges']
    scaler = StandardScaler()
    df[numerical] = scaler.fit_transform(df[numerical])
    
    return df, scaler