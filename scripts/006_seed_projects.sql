-- Seed projects data
INSERT INTO public.projects (id, name, description, status, progress, start_date, end_date, team_count) VALUES
(1, 'Ligala', 'Complete overhaul of company website with modern design and improved UX', 'In Progress', 65, '2024-01-15', '2024-03-30', 3),
(2, 'Mobile App Launch', 'Development and launch of iOS and Android mobile applications', 'Planning', 25, '2024-02-01', '2024-06-15', 4),
(3, 'Q4 Planning Initiative', 'Strategic planning and goal setting for the fourth quarter', 'Completed', 100, '2024-09-01', '2024-09-30', 2),
(4, 'Customer Support Portal', 'Implementation of new customer support ticketing system', 'In Progress', 40, '2024-01-20', '2024-04-10', 3),
(5, 'Data Analytics Dashboard', 'Business intelligence dashboard for real-time analytics', 'Planning', 15, '2024-03-01', '2024-07-15', 2),
(6, 'Security Audit & Compliance', 'Comprehensive security review and compliance implementation', 'In Progress', 30, '2024-02-15', '2024-05-30', 2);

-- Seed core features for Ligala project (ID 1)
INSERT INTO public.project_core_features (project_id, feature) VALUES
(1, 'User Management & Access Control - Role-based access permissions'),
(1, 'User Management & Access Control - Multi-tenant architecture with granular user segmentation'),
(1, 'User Management & Access Control - Integration with Microsoft Entra ID for identity federation and SSO'),
(1, 'User Management & Access Control - Conditional access policies and MFA enforcement'),
(1, 'User Management & Access Control - Audit logs and access history tracking'),
(1, 'KYC Integration - API-based integration with third-party KYC providers'),
(1, 'KYC Integration - Real-time identity verification workflow'),
(1, 'Document Management - Secure document upload and storage'),
(1, 'Compliance Tracking - Automated compliance monitoring and reporting');

-- Seed milestones for all projects
INSERT INTO public.project_milestones (project_id, title, status, start_date, end_date) VALUES
(1, 'Design Phase', 'completed', '2024-01-15', '2024-02-01'),
(1, 'Development Sprint 1', 'in-progress', '2024-02-01', '2024-02-28'),
(1, 'Testing & QA', 'pending', '2024-03-01', '2024-03-15'),
(1, 'Launch', 'pending', '2024-03-16', '2024-03-30'),
(2, 'Requirements Gathering', 'completed', '2024-02-01', '2024-02-15'),
(2, 'UI/UX Design', 'in-progress', '2024-02-16', '2024-03-15'),
(2, 'Development', 'pending', '2024-03-16', '2024-05-15'),
(2, 'Beta Testing', 'pending', '2024-05-16', '2024-06-01'),
(2, 'App Store Launch', 'pending', '2024-06-02', '2024-06-15'),
(3, 'Data Collection', 'completed', '2024-09-01', '2024-09-10'),
(3, 'Analysis', 'completed', '2024-09-11', '2024-09-20'),
(3, 'Strategy Development', 'completed', '2024-09-21', '2024-09-30'),
(4, 'System Selection', 'completed', '2024-01-20', '2024-02-05'),
(4, 'Configuration', 'in-progress', '2024-02-06', '2024-03-10'),
(4, 'Training', 'pending', '2024-03-11', '2024-03-25'),
(4, 'Go Live', 'pending', '2024-03-26', '2024-04-10'),
(5, 'Requirements Analysis', 'in-progress', '2024-03-01', '2024-03-20'),
(5, 'Data Integration', 'pending', '2024-03-21', '2024-05-01'),
(5, 'Dashboard Development', 'pending', '2024-05-02', '2024-06-30'),
(5, 'Deployment', 'pending', '2024-07-01', '2024-07-15'),
(6, 'Security Assessment', 'in-progress', '2024-02-15', '2024-03-15'),
(6, 'Remediation', 'pending', '2024-03-16', '2024-04-30'),
(6, 'Compliance Documentation', 'pending', '2024-05-01', '2024-05-30');

-- Seed project documents
INSERT INTO public.project_documents (project_id, name, type, url) VALUES
(1, 'Project Charter', 'PDF', 'https://sharepoint.company.com/sites/projects/ligala/charter.pdf'),
(1, 'Design Mockups', 'Figma', 'https://figma.com/file/ligala-designs'),
(1, 'Technical Specifications', 'PDF', 'https://sharepoint.company.com/sites/projects/ligala/tech-specs.pdf'),
(1, 'Meeting Notes', 'OneNote', 'https://sharepoint.company.com/sites/projects/ligala/notes'),
(2, 'App Requirements', 'PDF', 'https://sharepoint.company.com/sites/projects/mobile-app/requirements.pdf'),
(2, 'UI Wireframes', 'Figma', 'https://figma.com/file/mobile-app-wireframes'),
(3, 'Q4 Strategy Document', 'PDF', 'https://sharepoint.company.com/sites/projects/q4-planning/strategy.pdf'),
(4, 'System Documentation', 'PDF', 'https://sharepoint.company.com/sites/projects/support-portal/docs.pdf'),
(5, 'Dashboard Specifications', 'PDF', 'https://sharepoint.company.com/sites/projects/analytics/specs.pdf'),
(6, 'Security Audit Report', 'PDF', 'https://sharepoint.company.com/sites/projects/security/audit.pdf');

-- Seed project activities
INSERT INTO public.project_activities (project_id, user_name, action, timestamp) VALUES
(1, 'Sarah Miller', 'Updated project status to In Progress', NOW() - INTERVAL '2 days'),
(1, 'John Davis', 'Completed design mockups', NOW() - INTERVAL '5 days'),
(1, 'Mike Johnson', 'Started development sprint', NOW() - INTERVAL '1 day'),
(2, 'Emily Chen', 'Created project plan', NOW() - INTERVAL '7 days'),
(2, 'Lisa Anderson', 'Updated requirements document', NOW() - INTERVAL '3 days'),
(3, 'Robert Johnson', 'Completed Q4 strategy', NOW() - INTERVAL '30 days'),
(4, 'Alex Thompson', 'Configured support system', NOW() - INTERVAL '4 days'),
(5, 'Kevin Park', 'Started requirements analysis', NOW() - INTERVAL '6 days'),
(6, 'Daniel Kim', 'Initiated security assessment', NOW() - INTERVAL '10 days');

-- Reset sequence to continue from ID 7
SELECT setval('public.projects_id_seq', 6, true);
