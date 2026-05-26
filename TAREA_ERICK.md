# TAREA - Barja Ortiz Erick Gerson
# Modulo: Gestion de Usuarios y Enrutamiento General

Rama de trabajo: barja-ortiz-erick-gerson

---

## Responsabilidades

Tu modulo cubre dos cosas: la autenticacion de usuarios (login y registro) y el enrutamiento central de toda la app en App.tsx. Los demas integrantes dependen de que las rutas y el currentUser esten disponibles.

---

## Archivos que debes implementar

```
src/
├── App.tsx                            <- Enrutamiento general (tuyo)
└── components/
    └── Auth/
        ├── Login.tsx                  <- Formulario de inicio de sesion
        ├── Register.tsx               <- Formulario de registro
        └── UserList.tsx               <- Listado de usuarios registrados
```

---

## Paso 1 - App.tsx: Enrutamiento general

Usar react-router-dom. Las rutas que debes definir son las siguientes.

| Ruta | Componente | Notas |
|---|---|---|
| / | Redirige a /login | Usar Navigate |
| /login | Login | Publica |
| /register | Register | Publica |
| /users | UserList | Solo admin |
| /admin | Committee/ExamEditor | Lesly la implementa, tu solo la registras |
| /examenes | Student/ExamList | Benjamin la implementa |
| /examenes/:id | Student/TakeExam | Benjamin la implementa |
| /cv/:userId | PublicProfile/CVPage | David la implementa |
| /certificado/:hash | PublicProfile/CertificateView | David la implementa |

Logica de proteccion de rutas: antes de renderizar cualquier ruta protegida, leer currentUser de localStorage. Si no existe, redirigir a /login.

```tsx
// Ejemplo de componente de ruta protegida
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const user = getCurrentUser(); // importar de utils/storage
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}
```

---

## Paso 2 - Register.tsx

Formulario con los campos del tipo User definido en src/types.ts.

Campos requeridos:
- document (string) - DNI, sera el ID unico
- fullName (string)
- email (string)
- specialty (string)
- role: por defecto siempre sera 'student'. El primer usuario con DNI "admin" puede tener rol 'admin'.

Validaciones obligatorias:
- El campo document no puede estar vacio.
- El document no debe existir ya en la lista de usuarios (getUsers() de storage.ts).
- El email debe tener formato valido.
- Todos los campos son obligatorios.

Logica de guardado:
```ts
import { getUsers, saveUsers, setCurrentUser } from '../../utils/storage';
import { User } from '../../types';

const users = getUsers();
const existe = users.some(u => u.document === formData.document);
if (existe) { /* mostrar error */ return; }

const nuevoUsuario: User = { ...formData, role: 'student' };
saveUsers([...users, nuevoUsuario]);
setCurrentUser(nuevoUsuario);
// redirigir a /examenes
```

---

## Paso 3 - Login.tsx

Campos: document y una contrasena simple (puede ser el mismo document como contrasena para el parcial, o almacenar una contrasena en el objeto User si quieren mas realismo).

Logica:
```ts
const users = getUsers();
const usuario = users.find(u => u.document === inputDocument);
if (!usuario) { /* error: usuario no encontrado */ }
setCurrentUser(usuario);
// si usuario.role === 'admin' => redirigir a /admin
// si usuario.role === 'student' => redirigir a /examenes
```

---

## Paso 4 - UserList.tsx

Lista todos los usuarios registrados. Solo accesible para administradores.

Mostrar por cada usuario: document, fullName, email, specialty, role.

```ts
const users = getUsers(); // de utils/storage
```

---

## Dependencias del equipo

- Benjamin necesita que currentUser este guardado en localStorage para identificar al estudiante.
- Lesly necesita la ruta /admin disponible.
- David necesita la ruta /cv/:userId disponible.

---

## Comandos utiles

```bash
# Cambiar a tu rama
git checkout barja-ortiz-erick-gerson

# Ver estado
git status

# Guardar cambios
git add src/App.tsx src/components/Auth/
git commit -m "feat(auth): implementar login, registro y rutas"

# Subir cambios
git push origin barja-ortiz-erick-gerson
```
