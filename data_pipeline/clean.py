import pandas as pd
import zipfile
import os

def clean_data(filepath='WA_Fn-UseC_-Telco-Customer-Churn.csv'):
    if not os.path.exists(filepath) and os.path.exists('churn.zip'):
        with zipfile.ZipFile('churn.zip', 'r') as zip_ref:
            zip_ref.extractall('.')
            
    df = pd.read_csv(filepath)
    df.drop('customerID', axis=1, inplace=True)
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
    df['TotalCharges'] = df['TotalCharges'].fillna(df['TotalCharges'].median())
    df['Churn'] = df['Churn'].apply(lambda x: 1 if x == 'Yes' else 0)
    df['SeniorCitizen'] = df['SeniorCitizen'].astype('object')
    return df