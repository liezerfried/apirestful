// ============================================================================
// User.js — Modelo de Usuario (Sequelize)
// ============================================================================
// Define la estructura de la tabla "users" en MySQL usando el patrón de
// Modelo de Sequelize (hereda de Model). Incluye:
//
//   - Esquema: campos name, email (unique) y password
//   - Hook beforeCreate: encripta la contraseña ANTES de guardar en BD
//   - comparePassword(): compara contraseña plana contra el hash almacenado
//   - toJSON(): oculta el campo password cuando se serializa a JSON
//
// Patrón usado: Active Record — el modelo sabe cómo persistirse en la BD
// (User.create(), user.update(), user.destroy())
//
// Exporta: clase User (usada por controllers y models/index.js)
// ============================================================================

import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';

// La clase User hereda de Sequelize Model, lo que le da métodos como:
// User.create(), User.findOne(), User.findByPk(), user.update(), user.destroy()
class User extends Model {
    // Compara una contraseña en texto plano con el hash almacenado en la BD.
    // bcrypt.compare() aplica el mismo algoritmo y salt al texto plano
    // y verifica si produce el mismo hash. Retorna true/false.
    // Usado por: authController.login()
    async comparePassword(password) {
        return bcrypt.compare(password, this.password);
    }
    
    // Sobreescribe el método toJSON() de Sequelize.
    // Cuando Express ejecuta res.json(user), automáticamente llama a toJSON().
    // Aquí eliminamos el campo 'password' para que NUNCA se envíe al cliente,
    // incluso si el desarrollador olvida excluirlo manualmente.
    // Esto es una medida de SEGURIDAD importante.
    toJSON() {
        const values = Object.assign({}, this.get());
        delete values.password;
        return values;
    }
    
    // init() define el esquema de la tabla y las opciones del modelo.
    // Se llama desde models/index.js pasándole la instancia de Sequelize.
    static init(sequelize) {
        super.init({
            name: { type: DataTypes.STRING, allowNull: false },               // VARCHAR(255), no nulo
            email: { type: DataTypes.STRING, allowNull: false, unique: true }, // VARCHAR(255), no nulo, índice único
            password: { type: DataTypes.STRING, allowNull: false }             // VARCHAR(255), almacena el hash bcrypt
        }, {
            sequelize,
            modelName: 'User',
            tableName: 'users', // Nombre explícito de tabla (evita pluralización automática de Sequelize)
            hooks: {
                // Hook beforeCreate: se ejecuta AUTOMÁTICAMENTE antes de cada User.create().
                // Encripta la contraseña con bcrypt usando 10 salt rounds.
                // Salt rounds = número de iteraciones del algoritmo; 10 es un buen balance
                // entre seguridad y rendimiento (~10 hashes/segundo).
                // Así la contraseña NUNCA se guarda en texto plano en la BD.
                beforeCreate: async (user) => {
                    console.log(`[MODEL:User] Hook beforeCreate → Encriptando contraseña para: ${user.email}`);
                    user.password = await bcrypt.hash(user.password, 10);
                    console.log('[MODEL:User] Contraseña encriptada correctamente');
                },
                // Hook beforeUpdate: se ejecuta AUTOMÁTICAMENTE antes de cada user.update().
                // Solo encripta si el campo password fue modificado, evitando re-hashear
                // el hash ya almacenado cuando se actualizan otros campos (name, email).
                beforeUpdate: async (user) => {
                    if (user.changed('password')) {
                        console.log(`[MODEL:User] Hook beforeUpdate → Encriptando nueva contraseña para: ${user.email}`);
                        user.password = await bcrypt.hash(user.password, 10);
                        console.log('[MODEL:User] Contraseña actualizada y encriptada correctamente');
                    }
                }
            }
        });
        console.log('[MODEL:User] Esquema definido: name, email, password → tabla "users"');
    }
}

// Exportación por defecto del modelo User.
// Se importa en models/index.js para centralizar y en controllers para las operaciones CRUD.
export default User;