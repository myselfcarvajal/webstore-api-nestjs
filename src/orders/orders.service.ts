import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schema/order.schema';
import { Model, Types } from 'mongoose';
import { User } from 'src/users/schema/user.schema';
import { Product } from 'src/products/schema/product.schema';

type ProductItem = {
  productId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async getOrderByUserId(id: string) {
    return await this.orderModel.find({ userId: id });
  }

  async create(
    createOrderDto: CreateOrderDto,
    orderBy: string,
  ): Promise<Order> {
    const { products } = createOrderDto;

    const userId = orderBy;

    const user = await this.userModel.exists({
      _id: new Types.ObjectId(userId),
    });

    if (!user) throw new NotFoundException(`User with id ${userId} not found`);

    const productItem: ProductItem[] = [];
    let total = 0;

    // Iterar sobre los productos para validar su existencia y calcular el total
    for (const item of products) {
      const product = await this.productModel.findOne({
        _id: new Types.ObjectId(item.productId),
      });
      if (!product) {
        throw new NotFoundException(
          `Product with id ${item.productId} not found`,
        );
      }

      // Agregar el producto y la cantidad a la orden
      productItem.push({
        productId: item.productId,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: item.quantity,
      });

      // Calcular el total de la orden
      total += product.price * item.quantity;
    }

    // Crear la orden
    const order = await this.orderModel.create({
      userId,
      products: productItem,
      total,
    });

    return order;
  }

  async findAll(): Promise<Order[]> {
    return await this.orderModel.find();
  }

  async findById(id: string): Promise<Order> {
    const order = await this.orderModel.findOne({ _id: id });

    if (!order) throw new NotFoundException(`Order with id ${id} not found`);

    return order;
  }

  async getOrdersStats() {
    const ordersStats = await this.orderModel.aggregate([
      {
        $unwind: '$products', // Desglosa los productos dentro de cada orden
      },
      {
        $group: {
          _id: '$products.category', // Agrupar por categoría de producto
          totalSales: { $sum: '$products.quantity' }, // Total de productos vendidos por categoría
          totalRevenue: {
            $sum: { $multiply: ['$products.price', '$products.quantity'] },
          }, // Total recaudado por categoría
        },
      },
      {
        $group: {
          _id: null, // Agrupación global
          byCategory: {
            $push: {
              category: '$_id',
              totalSales: '$totalSales',
              totalRevenue: '$totalRevenue',
            },
          },
          totalSales: { $sum: '$totalSales' },
          totalRevenue: { $sum: '$totalRevenue' },
        },
      },
      {
        $project: {
          _id: 0, // Excluir el campo _id
          totalSales: 1,
          totalRevenue: 1,
          byCategory: 1,
        },
      },
    ]);

    return ordersStats[0] || { totalSales: 0, totalRevenue: 0, byCategory: [] };
  }
}
