-- Seed calendar events data
INSERT INTO public.calendar_events (title, description, start_time, end_time, location, attendees, color) VALUES
('All Hands Meeting', 'Quarterly company-wide meeting to discuss progress and upcoming initiatives', '2024-12-15 14:00:00', '2024-12-15 15:30:00', 'Main Conference Room / Teams', ARRAY['All Staff'], '#3b82f6'),
('Project Deadline: Website Redesign', 'Final deadline for the website redesign project deliverables', '2024-03-30 17:00:00', '2024-03-30 17:00:00', 'N/A', ARRAY['Sarah Miller', 'John Davis', 'Mike Johnson'], '#ef4444'),
('Team Building Event', 'Annual team building activities and lunch', '2024-12-20 12:00:00', '2024-12-20 16:00:00', 'Riverside Park', ARRAY['All Staff'], '#10b981'),
('Client Presentation', 'Q4 results presentation for key stakeholders', '2024-12-18 10:00:00', '2024-12-18 11:30:00', 'Executive Boardroom / Zoom', ARRAY['Management Team', 'Sales Team'], '#f59e0b');
