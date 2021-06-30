const mapDBToModel = ({ 
    id,
    title,
    year,
    performer,
    genre,
    duration,
    created_at,
    updated_at,
    name,
    username,
    
  }) => ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    insertedAt: created_at,
    updatedAt: updated_at,
    name,
    username,
    
  });

  module.exports = { mapDBToModel };