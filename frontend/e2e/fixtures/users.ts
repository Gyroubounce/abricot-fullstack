// Données de test pour les utilisateurs

export const testUsers = {
  // ===== NOUVEAU USER (créé dynamiquement pour chaque test) =====
   e2e: {
    email: "e2e@example.com",
    password: "TestPassword123!"
  },
  
  // ===== USERS DU SEED (existants dans la DB) =====
  alice: {
    name: 'Alice Martin',
    email: 'alice@example.com',
    password: 'password123'
  },
  
  bob: {
    name: 'Bob Dupont',
    email: 'bob@example.com',
    password: 'password123'
  },
  
  caroline: {
    name: 'Caroline Leroy',
    email: 'caroline@example.com',
    password: 'password123'
  },
  
  david: {
    name: 'David Moreau',
    email: 'david@example.com',
    password: 'password123'
  },
  
  emma: {
    name: 'Emma Rousseau',
    email: 'emma@example.com',
    password: 'password123'
  },
  
  francois: {
    name: 'François Dubois',
    email: 'francois@example.com',
    password: 'password123'
  },
  
  gabrielle: {
    name: 'Gabrielle Simon',
    email: 'gabrielle@example.com',
    password: 'password123'
  },
  
  henri: {
    name: 'Henri Laurent',
    email: 'henri@example.com',
    password: 'password123'
  },
  
  isabelle: {
    name: 'Isabelle Petit',
    email: 'isabelle@example.com',
    password: 'password123'
  },
  
  jacques: {
    name: 'Jacques Durand',
    email: 'jacques@example.com',
    password: 'password123'
  }
}as const;