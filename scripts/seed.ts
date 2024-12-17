import { hash } from 'bcrypt';
import mongoose from 'mongoose';
import { Role } from 'src/common/enums/role.enum';

const MONGO_URI = process.env.MONGODB_CONNECTION;

// Definir los esquemas manualmente
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'cliente'], required: true },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Crear los modelos directamente
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);

async function seed() {
  try {
    // Conectar a la base de datos MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('⏳ Conectando a la base de datos...');

    // Crear usuario admin
    const adminUser = await User.create({
      name: 'Will',
      surname: 'Douglas',
      email: 'willdouglas@gmail.com',
      password: await hash('password', 10),
      role: Role.ADMIN,
    });

    console.log('✅ Usuario admin creado:', adminUser.email);

    const clients = [
      await User.create({
        name: 'Juan',
        surname: 'Pérez',
        email: 'juanperez@gmail.com',
        password: await hash('password', 10),
        role: Role.CLIENTE,
      }),
      await User.create({
        name: 'María',
        surname: 'Gómez',
        email: 'mariagomez@gmail.com',
        password: await hash('password', 10),
        role: Role.CLIENTE,
      }),
      await User.create({
        name: 'Carlos',
        surname: 'Ramírez',
        email: 'carlosramirez@gmail.com',
        password: await hash('password', 10),
        role: Role.CLIENTE,
      }),
      await User.create({
        name: 'Ana',
        surname: 'López',
        email: 'analopez@gmail.com',
        password: await hash('password', 10),
        role: Role.CLIENTE,
      }),
    ];
    console.log('✅ Usuarios CLIENTE creados.');

    const products = [
      {
        name: 'Laptop Gaming HP',
        description:
          'Laptop de alto rendimiento para videojuegos con procesador i7, 16GB RAM y 512GB SSD.',
        price: 1200,
        category: 'Laptops',
        createdBy: clients[0]._id,
      },
      {
        name: 'Smartphone Samsung Galaxy S23',
        description:
          'Teléfono inteligente con pantalla AMOLED 120Hz, 8GB RAM y 256GB almacenamiento.',
        price: 999,
        category: 'Smartphones',
        createdBy: clients[1]._id,
      },
      {
        name: 'Auriculares Bluetooth Bose',
        description:
          'Auriculares inalámbricos con cancelación de ruido y 20 horas de duración de batería.',
        price: 350,
        category: 'Accesorios',
        createdBy: clients[2]._id,
      },
      {
        name: 'Teclado Mecánico Logitech',
        description:
          'Teclado mecánico retroiluminado con switches Romer-G, ideal para gaming.',
        price: 150,
        category: 'Accesorios',
        createdBy: clients[3]._id,
      },
      {
        name: 'Monitor 4K Dell',
        description:
          'Monitor Ultra HD 4K de 27 pulgadas con puertos HDMI y DisplayPort.',
        price: 450,
        category: 'Monitores',
        createdBy: clients[0]._id,
      },
      {
        name: 'Mouse Razer DeathAdder',
        description:
          'Mouse ergonómico para gaming con 16,000 DPI y retroiluminación RGB.',
        price: 75,
        category: 'Accesorios',
        createdBy: clients[1]._id,
      },
      {
        name: 'Tablet Apple iPad Pro',
        description:
          'Tablet de 12.9 pulgadas con chip M1, ideal para trabajo y entretenimiento.',
        price: 1100,
        category: 'Tablets',
        createdBy: clients[2]._id,
      },
      {
        name: 'SSD Externo Samsung 1TB',
        description:
          'Disco duro SSD externo portátil de 1TB con conectividad USB 3.2.',
        price: 130,
        category: 'Almacenamiento',
        createdBy: clients[3]._id,
      },
      {
        name: 'PC de Escritorio Alienware',
        description:
          'PC de alto rendimiento para gaming, con procesador Intel i9, 32GB RAM, y GPU RTX 3080.',
        price: 2500,
        category: 'PCs',
        createdBy: clients[0]._id,
      },
      {
        name: 'Cámara Web Logitech C920',
        description:
          'Cámara web Full HD 1080p para videoconferencias y streaming.',
        price: 85,
        category: 'Accesorios',
        createdBy: clients[1]._id,
      },
      {
        name: 'Router Wi-Fi 6 TP-Link',
        description:
          'Router Wi-Fi 6 con 12 puertos y velocidad de hasta 1.5Gbps.',
        price: 200,
        category: 'Redes',
        createdBy: clients[2]._id,
      },
      {
        name: 'Drone DJI Air 2S',
        description:
          'Drone con cámara 4K y sensor de 1 pulgada para fotografía aérea de alta calidad.',
        price: 999,
        category: 'Drones',
        createdBy: clients[3]._id,
      },
    ];

    // Insertar los productos en la base de datos
    await Product.insertMany(products);
    console.log('✅ Productos creados con éxito.');
  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
  } finally {
    // Cerrar la conexión a la base de datos
    mongoose.connection.close();
  }
}

seed();
