import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Checkout API: Received data:', JSON.stringify(body, null, 2));
    
    // Валидация обязательных полей для checkout
    if (!body.name || !body.telegram) {
      return NextResponse.json(
        { success: false, message: 'Name and Telegram are required' },
        { status: 400 }
      );
    }
    
    if (!body.products || !Array.isArray(body.products) || body.products.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Products are required' },
        { status: 400 }
      );
    }
    
    // Подготавливаем данные для backend
    const checkoutData = {
      project_name: body.name,
      short_description: body.products.map((p: any) => p.name).join(', '),
      technical_spec: body.message || '',
      timeline: '',
      telegram: body.telegram,
      promo: body.promo_code || '', // Используем promo вместо promo_code
      email: body.email || '',
      message: body.message || '',
      order_type: 'available',
      // Новые поля для checkout
      name: body.name,
      total_price: body.total_price,
      products: body.products
    };
    
    console.log('Checkout API: Sending to backend:', JSON.stringify(checkoutData, null, 2));
    
    // Отправляем на backend
    const backendResponse = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001'}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutData),
    });
    
    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      console.error('Checkout API: Backend error:', errorData);
      return NextResponse.json(
        { success: false, message: errorData.message || 'Failed to create checkout order' },
        { status: backendResponse.status }
      );
    }
    
    const result = await backendResponse.json();
    console.log('Checkout API: Backend response:', JSON.stringify(result, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Checkout order created successfully',
      data: result.data
    });
    
  } catch (error) {
    console.error('Checkout API: Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
