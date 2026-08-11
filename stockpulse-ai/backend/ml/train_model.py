import os
import json
from datetime import datetime, timezone

try:
    import joblib
except ImportError:
    import pickle as joblib

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

BASE_DIR = os.path.dirname(__file__)
DATASET_PATH = os.path.join(BASE_DIR, "training_data.csv")

# Versioned paths
MODELS_DIR = os.path.join(BASE_DIR, "models")
METADATA_DIR = os.path.join(MODELS_DIR, "metadata")
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(METADATA_DIR, exist_ok=True)

MODEL_VERSION = "rf_v1"
MODEL_PATH = os.path.join(MODELS_DIR, f"{MODEL_VERSION}.pkl")
METADATA_PATH = os.path.join(METADATA_DIR, f"{MODEL_VERSION}.json")

# Fallback top-level paths for backwards compatibility
LEGACY_MODEL_PATH = os.path.join(BASE_DIR, "random_forest.pkl")
LEGACY_METADATA_PATH = os.path.join(BASE_DIR, "model_metadata.json")

# Step 3: Explicit List of Input Features (Matrix X)
FEATURE_COLUMNS = [
    'Close', 'Volume', 'RSI_14', 'SMA_20', 'Price_SMA_Ratio',
    'MACD_Line', 'MACD_Signal', 'MACD_Hist', 'Volatility_20',
    'Sentiment_Avg', 'Positive_Ratio', 'Negative_Ratio', 'Article_Count',
    'earnings_flag', 'product_launch_flag', 'ceo_change_flag', 'merger_flag', 'dividend_flag'
]

def train_and_evaluate_model(model_version: str = MODEL_VERSION):
    """
    Executes Steps 1 through 8 of Day 4 & Day 5 versioning:
    - Step 1 & 2: Load and clean training_data.csv
    - Step 3: Perform Feature Selection (Matrix X and Vector y)
    - Step 4: Train / Test Split (80% train, 20% test)
    - Step 5: Train Random Forest Classifier
    - Step 6: Evaluate Model (Accuracy, Precision, Recall, F1, Confusion Matrix)
    - Step 7: Calculate Feature Importance
    - Step 8: Save Trained Model Artifacts (rf_v1.pkl & metadata/rf_v1.json)
    """
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Training dataset not found at {DATASET_PATH}. Run dataset_generator.py first.")

    print(f"[TrainModel] Loading dataset from: {DATASET_PATH}")
    df = pd.read_csv(DATASET_PATH)

    # Validate target label presence
    if 'Label' not in df.columns:
        raise ValueError("Dataset missing 'Label' target column.")

    # Step 3: Extract Matrix X and Vector y
    existing_features = [col for col in FEATURE_COLUMNS if col in df.columns]
    X = df[existing_features]
    y = df['Label']

    print(f"[TrainModel] Matrix X Shape: {X.shape}, Vector y Shape: {y.shape}")
    print(f"[TrainModel] Target Label Distribution:\n{y.value_counts(normalize=True).to_dict()}")

    # Step 4: Train / Test Split (80% Training, 20% Testing)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, shuffle=False
    )
    print(f"[TrainModel] Training samples: {len(X_train)}, Testing samples: {len(X_test)}")

    # Step 5: Train Random Forest Classifier
    print(f"[TrainModel] Fitting Random Forest Classifier ({model_version}, n_estimators=100)...")
    clf = RandomForestClassifier(
        n_estimators=100,
        max_depth=8,
        min_samples_split=5,
        random_state=42,
        n_jobs=-1
    )
    clf.fit(X_train, y_train)

    # Step 6: Evaluate Model Performance on Unseen Test Data
    y_pred = clf.predict(X_test)
    y_prob = clf.predict_proba(X_test)[:, 1]

    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, zero_division=0))
    rec = float(recall_score(y_test, y_pred, zero_division=0))
    f1 = float(f1_score(y_test, y_pred, zero_division=0))
    cm = confusion_matrix(y_test, y_pred).tolist()

    print("\n" + "="*50)
    print(f"MODEL EVALUATION METRICS ({model_version} - TEST SET)")
    print("="*50)
    print(f"Accuracy  : {acc * 100:.2f}%")
    print(f"Precision : {prec * 100:.2f}%")
    print(f"Recall    : {rec * 100:.2f}%")
    print(f"F1-Score  : {f1 * 100:.2f}%")
    print(f"Confusion Matrix:\n{np.array(cm)}")
    print("\nClassification Report:\n", classification_report(y_test, y_pred))

    # Step 7: Extract Feature Importances
    importances = clf.feature_importances_
    feat_importance_dict = {
        feat: round(float(imp), 4)
        for feat, imp in sorted(zip(existing_features, importances), key=lambda x: x[1], reverse=True)
    }

    print("\nTOP FEATURE IMPORTANCES:")
    for feat, imp in list(feat_importance_dict.items())[:8]:
        print(f"  • {feat:20s}: {imp * 100:.2f}%")

    target_model_path = os.path.join(MODELS_DIR, f"{model_version}.pkl")
    target_metadata_path = os.path.join(METADATA_DIR, f"{model_version}.json")

    # Step 8: Save Model Binary (.pkl) and Metadata JSON
    for path in [target_model_path, LEGACY_MODEL_PATH]:
        try:
            joblib.dump(clf, path)
        except Exception:
            with open(path, "wb") as f:
                joblib.dump(clf, f)
        print(f"[TrainModel] Saved model binary to: {path}")

    metadata = {
        "model": "RandomForestClassifier",
        "version": model_version,
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "features": existing_features,
        "metrics": {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "confusion_matrix": cm
        },
        "feature_importances": feat_importance_dict,
        "training_rows": len(X_train),
        "testing_rows": len(X_test)
    }

    for path in [target_metadata_path, LEGACY_METADATA_PATH]:
        with open(path, "w") as f:
            json.dump(metadata, f, indent=2)
        print(f"[TrainModel] Saved metadata report to: {path}")

    return clf, metadata

if __name__ == "__main__":
    train_and_evaluate_model()

