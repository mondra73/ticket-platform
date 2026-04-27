import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const PRESETS = [100, 1000, 10000, 100000];

export default function QueuePage() {
    const { user, isAuthenticated } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState(false);
    const [totalInQueue, setTotalInQueue] = useState(0);
    const [myPosition, setMyPosition] = useState<number | null>(null);
    const [estimatedWait, setEstimatedWait] = useState<number | null>(null);
    const [inQueue, setInQueue] = useState(false);
    const [simulating, setSimulating] = useState(false);
    const [customCount, setCustomCount] = useState('');
    const [log, setLog] = useState<string[]>([]);
    const logRef = useRef<HTMLDivElement>(null);

    const addLog = (msg: string) => {
        const time = new Date().toLocaleTimeString('es-AR');
        setLog(prev => [`[${time}] ${msg}`, ...prev].slice(0, 50));
    };

    useEffect(() => {
        const s = io('http://localhost:3000');

        s.on('connect', () => {
            setConnected(true);
            addLog('✅ Conectado al servidor WebSocket');
        });

        s.on('disconnect', () => {
            setConnected(false);
            addLog('❌ Desconectado del servidor');
        });

        s.on('queue_position', (data: { position: number; estimatedWait: number }) => {
            setMyPosition(data.position);
            setEstimatedWait(data.estimatedWait);
            addLog(`📍 Posición en cola: #${data.position} — Espera estimada: ${data.estimatedWait}s`);
        });

        s.on('queue_update', (data: { totalInQueue: number }) => {
            setTotalInQueue(data.totalInQueue);
        });

        s.on('queue_cleared', () => {
            setTotalInQueue(0);
            setMyPosition(null);
            setEstimatedWait(null);
            setInQueue(false);
            addLog('🗑️ Cola limpiada correctamente');
        });

        s.on('simulation_done', (data: { totalInQueue: number }) => {
            setSimulating(false);
            addLog(`🚀 Simulación completada — ${data.totalInQueue.toLocaleString()} usuarios en cola`);
        });

        s.on('queue_left', () => {
            setMyPosition(null);
            setEstimatedWait(null);
            setInQueue(false);
            addLog('👋 Saliste de la cola');
        });

        setSocket(s);
        return () => { s.disconnect(); };
    }, []);

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = 0;
        }
    }, [log]);

    const handleJoinQueue = () => {
        if (!socket || !isAuthenticated || !user) return;
        socket.emit('join_queue', { userId: user.id });
        setInQueue(true);
        addLog(`👤 Uniéndose a la cola (userId: ${user.id})`);
    };

    const handleLeaveQueue = () => {
        if (!socket || !user) return;
        socket.emit('leave_queue', { userId: user.id });
    };

    const handleSimulate = (count: number) => {
        if (!socket) return;
        setSimulating(true);
        socket.emit('simulate_load', { userCount: count });
        addLog(`⚡ Simulando ${count.toLocaleString()} usuarios...`);
    };

    const handleClearQueue = () => {
        if (!socket) return;
        socket.emit('clear_queue');
        addLog('🗑️ Limpiando cola...');
    };

    return (
        <div className="max-w-5xl mx-auto py-8 sm:py-12">
            {/* Header */}
            <div className="mb-10">
                <div className="inline-flex items-center gap-2 bg-amber/10 border border-amber/20 rounded-full px-4 py-1.5 mb-6">
                    <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                    <span className="text-amber text-[11px] font-semibold uppercase tracking-[0.25em]">
                        {connected ? 'WebSocket conectado' : 'Desconectado'}
                    </span>
                </div>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase text-white leading-[0.95] mb-4">
                    Simulador de <span className="text-amber">Cola</span>
                </h1>
                <p className="text-muted text-base max-w-xl">
                    Demostrá el sistema de cola virtual bajo alta demanda. Simulá hasta 100.000 usuarios comprando entradas simultáneamente y observá el comportamiento en tiempo real.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-4">

                    {/* Métricas */}
                    <div className="bg-surface-2/50 border border-border/50 rounded-2xl p-6">
                        <h2 className="font-display text-lg font-bold uppercase tracking-wider text-white mb-5">
                            Estado del sistema
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-surface/80 border border-border/30 rounded-xl p-4">
                                <p className="text-muted text-xs uppercase tracking-widest mb-2">Usuarios en cola</p>
                                <p className="font-display text-3xl font-black text-amber">
                                    {totalInQueue.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-surface/80 border border-border/30 rounded-xl p-4">
                                <p className="text-muted text-xs uppercase tracking-widest mb-2">Tu posición</p>
                                <p className="font-display text-3xl font-black text-white">
                                    {myPosition ? `#${myPosition}` : '—'}
                                </p>
                            </div>
                            <div className="bg-surface/80 border border-border/30 rounded-xl p-4 col-span-2">
                                <p className="text-muted text-xs uppercase tracking-widest mb-2">Espera estimada</p>
                                <p className="font-display text-3xl font-black text-white">
                                    {estimatedWait ? estimatedWait < 60 ? `${estimatedWait}s` : `${Math.floor(estimatedWait / 60)} min` : '—'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tu sesión */}
                    <div className="bg-surface-2/50 border border-border/50 rounded-2xl p-6">
                        <h2 className="font-display text-lg font-bold uppercase tracking-wider text-white mb-5">
                            Tu sesión
                        </h2>
                        {!isAuthenticated ? (
                            <p className="text-muted text-sm">
                                Iniciá sesión para unirte a la cola y ver tu posición.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {!inQueue ? (
                                    <button
                                        onClick={handleJoinQueue}
                                        disabled={!connected}
                                        className="w-full py-3 bg-amber hover:bg-amber-dark text-black rounded-lg text-sm font-bold uppercase tracking-widest transition-all duration-200 disabled:opacity-50"
                                    >
                                        Unirme a la cola
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleLeaveQueue}
                                        disabled={!connected}
                                        className="w-full py-3 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-lg text-sm font-bold uppercase tracking-widest transition-all duration-200 disabled:opacity-50"
                                    >
                                        Salir de la cola
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Simulador */}
                    <div className="bg-surface-2/50 border border-border/50 rounded-2xl p-6">
                        <h2 className="font-display text-lg font-bold uppercase tracking-wider text-white mb-2">
                            Simulador de carga
                        </h2>
                        <p className="text-muted text-xs mb-5">
                            Generá usuarios virtuales en cola para demostrar el sistema bajo alta demanda.
                        </p>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {PRESETS.map((count) => (
                                <button
                                    key={count}
                                    onClick={() => handleSimulate(count)}
                                    disabled={!connected || simulating}
                                    className="py-2.5 border border-border/50 text-text hover:border-amber/50 hover:text-amber rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 disabled:opacity-40"
                                >
                                    {simulating ? '...' : `+${count.toLocaleString()}`}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="number"
                                placeholder="Cantidad personalizada"
                                value={customCount}
                                onChange={(e) => setCustomCount(e.target.value)}
                                className="flex-1 bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-muted/50 focus:outline-none focus:border-amber transition-all"
                            />
                            <button
                                onClick={() => {
                                    const n = parseInt(customCount);
                                    if (n > 0) handleSimulate(n);
                                }}
                                disabled={!connected || simulating || !customCount}
                                className="px-4 py-2.5 bg-amber hover:bg-amber-dark text-black rounded-lg text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40"
                            >
                                Simular
                            </button>
                        </div>
                        <button
                            onClick={handleClearQueue}
                            disabled={!connected}
                            className="w-full py-2.5 border border-border/50 text-muted hover:border-red-500/50 hover:text-red-400 rounded-lg text-xs uppercase tracking-wider transition-all duration-200 disabled:opacity-40"
                        >
                            Limpiar cola
                        </button>
                    </div>
                </div>

                {/* Right column - Log */}
                <div className="bg-surface-2/50 border border-border/50 rounded-2xl p-6 flex flex-col">
                    <h2 className="font-display text-lg font-bold uppercase tracking-wider text-white mb-5">
                        Log en tiempo real
                    </h2>
                    <div
                        ref={logRef}
                        className="flex-1 overflow-y-auto space-y-2 min-h-[400px] max-h-[500px]"
                    >
                        {log.length === 0 ? (
                            <p className="text-muted text-xs text-center py-8">
                                Los eventos aparecerán acá...
                            </p>
                        ) : (
                            log.map((entry, i) => (
                                <div key={i} className="text-xs font-mono text-muted hover:text-text transition-colors py-1 border-b border-border/20">
                                    {entry}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}