import { getRelationships } from '@/lib/relationship.service';
import { NextResponse} from 'next/server';

type RouteParams = {
    params: {id: string};
}

export async function PUT(request: Request, {params}: RouteParams) {
    const userId = params.id;
    const body = await request.json();
    return NextResponse.json({updatedRelationship: body});
}

export async function DELETE(){

}