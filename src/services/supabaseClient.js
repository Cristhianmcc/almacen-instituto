const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

console.log('🔍 Verificando variables de entorno...');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Configurada' : '❌ No configurada');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ No configurada');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Las variables SUPABASE_URL y SUPABASE_ANON_KEY son requeridas');
  console.error('📁 Verifica que el archivo .env existe en la raíz del proyecto');
  console.error('🔧 Verifica que las variables están configuradas correctamente');
  throw new Error('Las variables SUPABASE_URL y SUPABASE_ANON_KEY son requeridas');
}

console.log('✅ Conectando a Supabase...');
// Cliente principal para operaciones normales
const supabase = createClient(supabaseUrl, supabaseKey);

// Cliente con privilegios administrativos para operaciones especiales
const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Verificar conexión
supabase.from('productos').select('count', { count: 'exact', head: true })
  .then(({ count, error }) => {
    if (error) {
      console.warn('⚠️  Advertencia: No se pudo conectar a la tabla productos:', error.message);
      console.warn('📋 Asegúrate de ejecutar el script SQL en Supabase (docs/database-schema.sql)');
    } else {
      console.log('✅ Conexión a Supabase exitosa');
    }
  })
  .catch(err => {
    console.warn('⚠️  Advertencia: Error al verificar conexión:', err.message);
  });

module.exports = {
  supabase,
  supabaseAdmin
};
