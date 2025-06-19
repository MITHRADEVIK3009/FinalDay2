-- Seed sample data for testing

-- Insert sample schemes
INSERT INTO schemes (title, description, department, category, country, required_documents, amount, status) VALUES
('SNAP', 'Supplemental Nutrition Assistance Program - Food assistance for low-income individuals and families', 'USDA', 'Food Security', 'USA', ARRAY['Proof of identity', 'Social Security Number', 'Proof of income', 'Proof of expenses'], '$200-800/month', 'active'),
('PMAY', 'Pradhan Mantri Awas Yojana - Housing subsidy for economically weaker sections', 'Ministry of Housing', 'Housing', 'India', ARRAY['Aadhaar card', 'Income certificate', 'Identity proof', 'Address proof'], '₹2.5 lakh subsidy', 'active'),
('Dibao', 'Minimum Livelihood Guarantee - Basic living standard for low-income residents', 'Ministry of Civil Affairs', 'Social Security', 'China', ARRAY['Resident Identity Card', 'Household registration', 'Proof of family income'], '¥500-1500/month', 'active'),
('RSA', 'Revenu de Solidarité Active - Income support for individuals with little or no income', 'Ministry of Social Affairs', 'Income Support', 'France', ARRAY['National ID', 'Proof of residence', 'Income details', 'Family composition'], '€500-800/month', 'active'),
('Bürgergeld', 'Citizen Income - Basic income support for unemployed individuals', 'Federal Employment Agency', 'Unemployment', 'Germany', ARRAY['National ID', 'Proof of address', 'Bank statements', 'Employment status'], '€400-600/month', 'active'),
('PM-KISAN', 'Direct income support to farmers', 'Ministry of Agriculture', 'Agriculture', 'India', ARRAY['Land ownership documents', 'Aadhaar card', 'Bank account details'], '₹6,000/year', 'active'),
('Ayushman Bharat', 'Health insurance coverage for low-income households', 'Ministry of Health', 'Healthcare', 'India', ARRAY['Aadhaar card', 'Income certificate', 'Family composition proof'], '₹5 lakh coverage', 'active');

-- Insert more popular schemes
INSERT INTO schemes (title, description, department, category, country, required_documents, status) VALUES
('Medicaid', 'Free or low-cost health coverage', 'HHS', 'Healthcare', 'USA', ARRAY['ID proof', 'Income proof', 'Residency proof'], 'active'),
('Section 8 Housing', 'Rental assistance for low-income families', 'HUD', 'Housing', 'USA', ARRAY['Income verification', 'Family composition', 'Citizenship proof'], 'active'),
('TANF', 'Cash assistance for families with children', 'HHS', 'Family Support', 'USA', ARRAY['Birth certificates', 'Income proof', 'Social Security'], 'active'),
('Unemployment Insurance', 'Temporary financial assistance for unemployed', 'DOL', 'Employment', 'USA', ARRAY['Employment history', 'ID proof', 'Bank details'], 'active'),
('MGNREGA', '100 days guaranteed wage employment', 'Ministry of Rural Development', 'Employment', 'India', ARRAY['Job card', 'Bank account', 'Address proof'], 'active'),
('Atal Pension Yojana', 'Pension scheme for unorganized sector', 'PFRDA', 'Pension', 'India', ARRAY['Aadhaar', 'Bank account', 'Age proof'], 'active'),
('NRCMS', 'Health insurance for rural residents', 'National Health Commission', 'Healthcare', 'China', ARRAY['Rural registration', 'ID card', 'Medical records'], 'active'),
('Housing Provident Fund', 'Savings scheme for housing purchase', 'Ministry of Housing', 'Housing', 'China', ARRAY['Employment proof', 'Salary certificate', 'Bank account'], 'active'),
('Unemployment Insurance', 'Monthly benefits for job loss', 'Ministry of Human Resources', 'Employment', 'China', ARRAY['Employment history', 'Termination certificate', 'ID proof'], 'active'),
('Old-Age Pension', 'Retirement benefits for senior citizens', 'Ministry of Human Resources', 'Pension', 'China', ARRAY['Age certificate', 'Contribution records', 'Bank details'], 'active'),
('Pôle emploi', 'Support and financial aid for job seekers', 'Ministry of Labor', 'Employment', 'France', ARRAY['Work permit', 'CV', 'Termination letter'], 'active'),
('CMU-C', 'Free complementary health insurance', 'Ministry of Health', 'Healthcare', 'France', ARRAY['Income proof', 'Residency permit', 'Tax documents'], 'active'),
('APL', 'Housing allowance to help pay rent', 'Ministry of Housing', 'Housing', 'France', ARRAY['Rental agreement', 'Income proof', 'Bank details'], 'active'),
('Prime d activité', 'Monthly supplement for low-income workers', 'Ministry of Social Affairs', 'Income Support', 'France', ARRAY['Pay slips', 'Tax returns', 'Bank statements'], 'active'),
('Kindergeld', 'Monthly allowance for children costs', 'Federal Family Office', 'Family Support', 'Germany', ARRAY['Birth certificate', 'Tax ID', 'Bank account'], 'active'),
('Elterngeld', 'Financial support after childbirth', 'Federal Family Office', 'Family Support', 'Germany', ARRAY['Birth certificate', 'Income proof', 'Employment status'], 'active'),
('BAföG', 'Education grants for students', 'Federal Education Office', 'Education', 'Germany', ARRAY['Enrollment certificate', 'Income proof', 'Academic records'], 'active'),
('Health Insurance', 'Universal healthcare coverage', 'Federal Health Ministry', 'Healthcare', 'Germany', ARRAY['Residence permit', 'Employment status', 'Income proof'], 'active');

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type) VALUES
(uuid_generate_v4(), 'Land Certificate Approved', 'Your land ownership certificate has been approved and is ready for download.', 'success'),
(uuid_generate_v4(), 'Document verification pending', 'Please submit additional documents for your income certificate application.', 'warning'),
(uuid_generate_v4(), 'New scheme available for farmers', 'PM-KISAN scheme is now accepting applications. Check if you are eligible.', 'info');
