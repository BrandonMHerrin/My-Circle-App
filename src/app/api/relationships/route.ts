import { getRelationships } from '@/lib/relationship.service';
import { NextResponse} from 'next/server';

export async function GET() {
    const relationships = await getRelationships
    return NextResponse.json({relationships});
}

export async function POST(request: Request) {
    const body = await request.json();
    return NextResponse.json({created: body});
}
