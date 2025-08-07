const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Configuración
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key'
const JWT_EXPIRES_IN = '24h'

// Verificar credenciales
async function verifyCredentials(username, password) {
  try {
    // CREDENCIALES TEMPORALES HARDCODEADAS (cambiar después)
    const adminUsername = 'tnlp-admin'
    const adminPasswordHash = '$2b$12$rKJwlmjUmMS.ovtx4hYl5e./w8ZYkpo1RPqB/HRqPQoByt8UHCWVK'
    
    console.log('🔍 Debug login:')
    console.log('Usuario recibido:', username)
    console.log('Usuario esperado:', adminUsername)
    console.log('Password recibido:', password)
    console.log('Hash configurado:', adminPasswordHash ? 'SÍ' : 'NO')
    
    // Verificar usuario
    if (username !== adminUsername) {
      console.log('❌ Usuario incorrecto')
      return { success: false, error: 'Credenciales inválidas' }
    }
    
    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, adminPasswordHash)
    console.log('¿Password válido?:', isValidPassword ? '✅ SÍ' : '❌ NO')
    
    if (!isValidPassword) {
      return { success: false, error: 'Credenciales inválidas' }
    }
    
    console.log('✅ Login exitoso')
    return { success: true }
  } catch (error) {
    console.error('Error verifying credentials:', error)
    return { success: false, error: 'Error interno del servidor' }
  }
}

// Crear token JWT
function createToken(username) {
  try {
    const payload = {
      username,
      isAdmin: true,
      iat: Math.floor(Date.now() / 1000)
    }
    
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
  } catch (error) {
    console.error('Error creating token:', error)
    throw new Error('Error al crear token')
  }
}

// Verificar token JWT
function verifyToken(token) {
  try {
    if (!token) {
      return { success: false, error: 'Token no proporcionado' }
    }
    
    const decoded = jwt.verify(token, JWT_SECRET)
    
    return { 
      success: true, 
      payload: decoded 
    }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { success: false, error: 'Token expirado' }
    }
    if (error.name === 'JsonWebTokenError') {
      return { success: false, error: 'Token inválido' }
    }
    
    console.error('Error verifying token:', error)
    return { success: false, error: 'Error al verificar token' }
  }
}

// Generar hash de contraseña (utilitario para development)
async function hashPassword(password) {
  try {
    const saltRounds = 12
    return await bcrypt.hash(password, saltRounds)
  } catch (error) {
    console.error('Error hashing password:', error)
    throw new Error('Error al hashear contraseña')
  }
}

// Middleware para verificar autenticación
function requireAuth(handler) {
  return async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '') || 
                   req.cookies?.adminToken
      
      const verification = verifyToken(token)
      
      if (!verification.success) {
        return res.status(401).json({ 
          success: false, 
          error: verification.error 
        })
      }
      
      // Agregar información del usuario a la request
      req.user = verification.payload
      
      return handler(req, res)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return res.status(500).json({ 
        success: false, 
        error: 'Error interno del servidor' 
      })
    }
  }
}

// Exports
module.exports = {
  verifyCredentials,
  createToken,
  verifyToken,
  hashPassword,
  requireAuth
}