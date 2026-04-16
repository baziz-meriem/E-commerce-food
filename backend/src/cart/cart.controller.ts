import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/current-user.decorator';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cart: CartService) {}

  @Get()
  get(@CurrentUser() user: AuthUser) {
    return this.cart.getCart(user.id);
  }

  @Post('items')
  add(
    @CurrentUser() user: AuthUser,
    @Body() body: { productId: string; quantity?: number },
  ) {
    return this.cart.addItem(user.id, body.productId, body.quantity ?? 1);
  }

  @Patch('items/:id')
  setQty(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() body: { quantity: number },
  ) {
    return this.cart.setQuantity(user.id, id, body.quantity);
  }

  @Delete('items/:id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.cart.removeItem(user.id, id);
  }
}
