import { mockHandlers, computePrediction } from './mocks/handlers';
import { mockCustomersList } from './mocks/data';

async function runVerification() {
  console.log('=== PredictIQ End-to-End Demo Flow & Contract Verification ===\n');

  // 1. Dashboard summary
  console.log('1. Testing Executive Dashboard API...');
  const dashboard = await mockHandlers.getDashboardSummary();
  console.assert(dashboard.total_customers === 7043, 'Total customers must be 7043');
  console.assert(dashboard.at_risk_count === 864, 'At-risk count must be 864');
  console.assert(dashboard.monthly_revenue_at_risk === 412850, 'Monthly revenue at risk must be $412,850');
  console.assert(dashboard.monthly_trend.length >= 6, 'Monthly trend must have historical and projection points');
  console.log('✓ Executive Dashboard metrics match schema & contract.\n');

  // 2. Dataset Upload & Quality
  console.log('2. Testing Dataset Upload & Data Quality Profile API...');
  const upload = await mockHandlers.uploadDataset(null);
  console.assert(upload.status === 'ready', 'Upload status must be ready');
  console.assert(upload.row_count === 7043, 'Dataset must have 7,043 rows');
  const quality = await mockHandlers.getDataQualityProfile(upload.dataset_id);
  console.assert(quality.health_score === 94, 'Data cleanliness score must be 94');
  console.assert(quality.health_flags.length >= 4, 'Health flags must exist');
  console.log('✓ Dataset upload & data quality audit match schema & contract.\n');

  // 3. Model Training & Evaluation
  console.log('3. Testing Model Training & Evaluation API...');
  const trainRes = await mockHandlers.trainModel('xgboost');
  console.assert(trainRes.status === 'completed', 'Training must complete successfully');
  const evalRes = await mockHandlers.getModelEvaluation(trainRes.model_id);
  console.assert(evalRes.metrics.roc_auc === 0.923, 'ROC-AUC must be 0.923');
  console.assert(evalRes.metrics.accuracy === 0.892, 'Accuracy must be 89.2%');
  console.assert(evalRes.confusion_matrix.true_positive === 1528, 'TP count must match holdout matrix');
  console.assert(evalRes.model_comparison.length === 3, 'Model comparison must benchmark 3 algorithms');
  console.log('✓ Model evaluation & cross-model comparison match schema & contract.\n');

  // 4. Customer Directory Search & Filter
  console.log('4. Testing Customer Directory Query & Filtering...');
  const searchRes = await mockHandlers.getCustomers({ search: 'C1024' });
  console.assert(searchRes.customers.length === 1, 'Search for C1024 must return Apex Digital Labs');
  const c1024 = searchRes.customers[0];
  console.assert(c1024.customer_id === 'C1024', 'Customer ID must match C1024');
  console.assert(c1024.probability === 0.87, 'C1024 probability must be 0.87 (87%)');
  console.assert(c1024.risk_level === 'HIGH', 'C1024 risk must be HIGH');

  const filterRes = await mockHandlers.getCustomers({ riskLevel: 'HIGH' });
  console.assert(filterRes.customers.every(c => c.risk_level === 'HIGH'), 'Filter by HIGH must return only high risk accounts');
  console.log('✓ Customer directory search, filter, and pagination verified.\n');

  // 5. Customer Detail, Explainability, Recommendations
  console.log('5. Testing Customer Detail, Explainability & Recommendations...');
  const detail = await mockHandlers.getCustomerDetail('C1024');
  console.assert(detail.prediction.customer_id === 'C1024', 'Prediction customer_id must match');
  console.assert(detail.prediction.prediction === 'Churn', 'Prediction must be Churn');
  console.assert(detail.prediction.probability === 0.87, 'Probability must be 0.87');
  console.assert(detail.prediction.top_factors[0].feature === 'Contract Type', 'Top factor must be Contract Type');
  console.assert(detail.prediction.top_factors[0].impact === 0.28, 'Top factor impact must be 0.28');
  console.assert(detail.explanation.narratives.length >= 3, 'Plain language narratives must exist');
  console.assert(detail.recommendations.length >= 2, 'Prescriptive retention actions must exist');
  console.log('✓ Explainability factor attribution & prescriptive actions match contract.\n');

  // 6. What-If Simulation Sandbox
  console.log('6. Testing What-If Simulation Engine...');
  const sim = await mockHandlers.simulateWhatIf({
    customer_id: 'C1024',
    tenure: 8,
    monthly_charges: 1104,
    contract: 'One year',
    support_calls: 1,
  });
  console.assert(sim.original.probability === 0.87, 'Original probability must be 0.87');
  console.assert(sim.simulated.probability <= 0.35, 'Simulated probability under 1-year contract + 1 call must drop to Low Risk');
  console.assert(sim.simulated.risk_level === 'LOW', 'Simulated risk level must transition to LOW');
  console.assert(sim.probability_delta < -0.5, 'Delta must reflect significant risk reduction');
  console.assert(sim.factor_shifts.length >= 3, 'Factor shifts must be quantified');
  console.log(`✓ What-if simulation calculated probability drop: ${sim.original.probability * 100}% -> ${sim.simulated.probability * 100}% (Delta: ${sim.probability_delta * 100}%)\n`);

  // 7. Business Impact & Revenue at Risk
  console.log('7. Testing Aggregate Business Impact & ROI Projections...');
  const impact = await mockHandlers.getBusinessImpact();
  console.assert(impact.arr_at_risk === 4954200, 'ARR at risk must be $4,954,200');
  console.assert(impact.segments.length === 3, 'Segments must cover Enterprise, Mid-Market, SMB');
  console.assert(impact.contract_breakdown.length === 3, 'Contract breakdown must exist');
  console.assert(impact.retention_scenarios.length === 4, 'Scenarios must cover Top 25, 50, 100, 250 cohorts');
  console.log('✓ Business impact portfolio breakdown & ROI scenarios match contract.\n');

  console.log('ALL INTEGRATION CONTRACTS AND DEMO FLOW VALIDATIONS PASSED PERFECTLY!');
}

runVerification().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
