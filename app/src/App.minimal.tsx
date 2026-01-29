console.log('🚀 Minimal App Loading');

function App() {
    console.log('🎨 Minimal App Rendering');
    return (
        <div style={{ padding: '50px', background: '#05050A', minHeight: '100vh', color: 'white' }}>
            <h1>✅ React is Working!</h1>
            <p>If you see this, React is rendering correctly.</p>
        </div>
    );
}

console.log('📦 Minimal App Exported');
export default App;
