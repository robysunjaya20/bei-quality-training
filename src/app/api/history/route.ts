import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
function endpoint(){const value=process.env.NEXT_PUBLIC_GAS_REPORT_RECHECKING;if(!value||!value.endsWith('/exec'))throw new Error('NEXT_PUBLIC_GAS_URL belum diatur.');return value;}
export async function GET(){try{const response=await fetch(`${endpoint()}?action=list&_=${Date.now()}`,{cache:'no-store',redirect:'follow'});const data=await response.json();return NextResponse.json(data,{status:response.ok?200:502});}catch(e){return NextResponse.json({ok:false,error:e instanceof Error?e.message:'Gagal menghubungi Google Apps Script.'},{status:502});}}
export async function POST(request:NextRequest){try{const payload=await request.json();const response=await fetch(endpoint(),{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload),cache:'no-store',redirect:'follow'});const data=await response.json();return NextResponse.json(data,{status:response.ok?200:502});}catch(e){return NextResponse.json({ok:false,error:e instanceof Error?e.message:'Gagal menghubungi Google Apps Script.'},{status:502});}}
