// Se importa desde el controlador para definir el modelo y luego se exporta para ser usado por el controlador

import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';

// 👇 DEFINE la clase que será importada
class User extends Model {
    // 👇 Método que usa el controlador: user.comparePassword()
    async comparePassword(password) {
        // bcrypt.compare devuelve true o false dependiendo si la contraseña coincide con el hash almacenado
        return bcrypt.compare(password, this.password);
    }
    
    // 👇 Método que usa automáticamente: res.json(user)
    toJSON() {
        const values = Object.assign({}, this.get());
        delete values.password;
        return values;
    }
    
    static init(sequelize) {
        super.init({
            name: { type: DataTypes.STRING, allowNull: false },
            email: { type: DataTypes.STRING, allowNull: false, unique: true },
            password: { type: DataTypes.STRING, allowNull: false }
        }, {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            hooks: {
                beforeCreate: async (user) => {
                    console.log(`[MODEL:User] Hook beforeCreate → Encriptando contraseña para: ${user.email}`);
                    user.password = await bcrypt.hash(user.password, 10);
                    console.log('[MODEL:User] Contraseña encriptada correctamente');
                }
            }
        });
        console.log('[MODEL:User] Esquema definido: name, email, password → tabla "users"');
    }
}

// 👇 EXPORTA para ser importado por el controlador
export default User;