import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret') || req.headers.get('authorization')?.replace('Bearer ', '');
  const validSecret = process.env.ADMIN_SECRET || 'admin_instrctr_secure';

  if (!secret || secret !== validSecret) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, count: applications.length, applications });
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret') || req.headers.get('authorization')?.replace('Bearer ', '');
  const validSecret = process.env.ADMIN_SECRET || 'admin_instrctr_secure';

  if (!secret || secret !== validSecret) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing application ID' }, { status: 400 });
    }

    const updated = await prisma.application.update({
      where: { id: Number(id) },
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
    });

    return NextResponse.json({ success: true, application: updated });
  } catch (error) {
    console.error('Update application error:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}
