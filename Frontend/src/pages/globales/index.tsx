import DefaultLayout from "@/layouts/default";
import { Link } from 'react-router-dom';

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div>
          <h1>Bienvenido</h1>
          <Link
            to="/login"
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: '#fff',
              borderRadius: '4px',
              textDecoration: 'none',
              display: 'inline-block',
              marginTop: '10px',
            }}
          >
            Iniciar sesión
          </Link>
        </div>
      </section>
    </DefaultLayout>
  );
}