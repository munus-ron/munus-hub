-- Create project_document_comments table
CREATE TABLE IF NOT EXISTS project_document_comments (
  id SERIAL PRIMARY KEY,
  document_id INTEGER NOT NULL REFERENCES project_documents(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE project_document_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for project_document_comments
CREATE POLICY "document_comments_select_all" ON project_document_comments FOR SELECT USING (true);
CREATE POLICY "document_comments_insert_all" ON project_document_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "document_comments_delete_all" ON project_document_comments FOR DELETE USING (true);
CREATE POLICY "document_comments_update_all" ON project_document_comments FOR UPDATE USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_document_comments_document_id ON project_document_comments(document_id);
