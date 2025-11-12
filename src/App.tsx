import './App.css'

function App() {
    const Watermark = () => (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'url(/corno_hamal.svg) center center no-repeat',
            backgroundSize: 'contain',
            opacity: 0.2,
            pointerEvents: 'none',
            zIndex: 9999,
        }} />
    );
    const redirectUri = "http://localhost:8082/ala/v1/swagger-ui/index.html";
    return (
        <div style={{ maxWidth: 400, margin: "auto", padding: 20, fontFamily: "sans-serif" }}>
            <Watermark />
            <h2>Benvenuto!</h2>
            <hr />
            {/*<h3>Oppure</h3>*/}

            <div className="flex flex-col items-center gap-4 mt-10">
                <a
                    href={`${import.meta.env.VITE_KC_LOGIN_URL}?redirect_uri=${encodeURIComponent(redirectUri)}`}
                    className="btn btn-keycloak"
                >
                    Accedi con Keycloak
                </a>
            </div>
        </div>
    );
}
export default App;