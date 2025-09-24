-- SQL Server schema for jSmartAssist.AI RAG system

CREATE TABLE Documents (
    Id INT IDENTITY PRIMARY KEY,
    FileName NVARCHAR(255) NOT NULL,
    ContentType NVARCHAR(100),
    UploadedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    IsProcessed BIT DEFAULT 0
);

CREATE TABLE DocumentChunks (
    Id INT IDENTITY PRIMARY KEY,
    DocumentId INT NOT NULL FOREIGN KEY REFERENCES Documents(Id) ON DELETE CASCADE,
    Text NVARCHAR(MAX) NOT NULL,
    EmbeddingVector NVARCHAR(MAX) NULL -- JSON serialized float[]
);

CREATE TABLE ChatSessions (
    Id NVARCHAR(100) PRIMARY KEY,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
);

CREATE TABLE ChatMessages (
    Id INT IDENTITY PRIMARY KEY,
    SessionId NVARCHAR(100) NOT NULL FOREIGN KEY REFERENCES ChatSessions(Id) ON DELETE CASCADE,
    Sender NVARCHAR(50) NOT NULL,
    Message NVARCHAR(MAX) NOT NULL,
    SentAt DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Indexes for performance
CREATE INDEX IX_DocumentChunks_DocumentId ON DocumentChunks(DocumentId);
CREATE INDEX IX_Documents_IsProcessed ON Documents(IsProcessed);
CREATE INDEX IX_ChatMessages_SessionId ON ChatMessages(SessionId);
