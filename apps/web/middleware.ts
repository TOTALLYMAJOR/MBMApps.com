import { NextRequest, NextResponse } from 'next/server';
import { GATE_COOKIE_NAME, getGateConfiguration, verifyGateToken } from '@/lib/site-gate';

function isPublicEntrancePath(pathname: string) {
  return pathname === '/gate'
    || pathname === '/api/site-gate'
    || pathname.startsWith('/_next/')
    || pathname === '/icon.svg'
    || pathname === '/favicon.ico';
}

export async function middleware(request: NextRequest) {
  const configuration = getGateConfiguration();
  if (!configuration.enabled || isPublicEntrancePath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(GATE_COOKIE_NAME)?.value;
  if (await verifyGateToken(token, configuration.secret)) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json(
      { ok: false, message: 'Signal Lock access is required.' },
      { status: 401 }
    );
  }

  const entrance = request.nextUrl.clone();
  entrance.pathname = '/gate';
  entrance.search = '';
  entrance.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(entrance);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg).*)']
};
