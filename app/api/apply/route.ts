import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get('name')?.toString()?.trim() || '';
    const phone = formData.get('phone')?.toString()?.trim() || '';
    const email = formData.get('email')?.toString()?.trim() || '';
    const city = formData.get('city')?.toString()?.trim() || '';
    const area = formData.get('area')?.toString()?.trim() || '';
    const licence = formData.get('licence')?.toString()?.trim() || '';
    
    // Vehicles can come as multiple entries or comma separated
    const vehicleEntries = formData.getAll('vehicle');
    const vehicles = vehicleEntries.map(v => v.toString()).join(', ') || formData.get('vehicles')?.toString() || '';

    if (!name || !phone || !email || !city || !area || !licence) {
      return NextResponse.json(
        { error: 'All required fields must be provided.' },
        { status: 400 }
      );
    }

    let documentPath: string | null = null;
    let documentOriginalName: string | null = null;

    const file = formData.get('file') as File | null;
    if (file && file.size > 0 && typeof file.arrayBuffer === 'function') {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      
      // Ensure directory exists
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Create safe unique filename
      const cleanOriginalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      documentOriginalName = file.name;
      const uniqueFileName = `${Date.now()}_${cleanOriginalName}`;
      const filePath = path.join(uploadsDir, uniqueFileName);

      await fs.promises.writeFile(filePath, buffer);
      documentPath = `/uploads/${uniqueFileName}`;
    }

    const application = await prisma.application.create({
      data: {
        name,
        phone,
        email,
        city,
        area,
        vehicles: vehicles || 'Not specified',
        licenceNumber: licence,
        documentPath,
        documentOriginalName,
        status: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Application received successfully',
      id: application.id,
    });
  } catch (error) {
    console.error('Error processing application:', error);
    return NextResponse.json(
      { error: 'Internal Server Error. Please try again later.' },
      { status: 500 }
    );
  }
}
