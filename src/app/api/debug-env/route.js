import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const envVars = {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV
    }
    
    console.log('🔍 Variables de entorno en producción:', envVars)
    
    return NextResponse.json({
      success: true,
      environment: envVars,
      message: 'Variables de entorno verificadas'
    })
  } catch (error) {
    console.error('Error verificando variables:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
