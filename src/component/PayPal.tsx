import { useEffect, useRef, useState } from "react";

const PayPal = () => {
    const loadedRef = useRef(false);
    const paypalRef = useRef<HTMLDivElement | null>(null);
    const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
    const [errMsg, setErrMsg] = useState<string | null>(null);

    useEffect(() => {
        if (loadedRef.current) return;
        loadedRef.current = true;
        const container = paypalRef.current;
        if (!container) return;
        const CLIENT_ID = (import.meta.env.VITE_PAYPAL_CLIENT_ID as string) || "TUO_SANDBOX_CLIENT_ID";
        if (!CLIENT_ID || CLIENT_ID === "TUO_SANDBOX_CLIENT_ID") {
            setErrMsg("Manca il PayPal client-id (controlla VITE_PAYPAL_CLIENT_ID).");
            setStatus("error");
            console.error("PayPal: missing client id");
            return;
        }
        setStatus("loading");
        const existing = document.querySelector<HTMLScriptElement>(`script[data-paypal="true"]`);
        let script: HTMLScriptElement;
        if (existing) {
            script = existing;
        } else {
            script = document.createElement("script");
            script.setAttribute("data-paypal", "true");
            script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(CLIENT_ID)}&currency=EUR`;
            script.async = true;
            document.body.appendChild(script);
        }

        const onLoad = () => {
            if (!(window as any).paypal) {
                setErrMsg("Script caricato ma window.paypal non è definito. Controlla CSP o estensioni.");
                setStatus("error");
                console.error("PayPal: window.paypal not found after script load");
                return;
            }
            if (!paypalRef.current) {
                setErrMsg("Div di mount non trovato.");
                setStatus("error");
                return;
            }

            try {
                (window as any).paypal.Buttons({
                    createOrder: () => {
                        return fetch("/ala/v1/payments/create-order", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ "amount": "9.99" }),
                        })
                            .then((res) => {
                                if (!res.ok) throw new Error(`create-order returned ${res.status}`);
                                return res.json();
                            })
                            .then((data) => {
                                if (!data || !data.orderId) throw new Error("create-order non ha restituito orderId");
                                return data.orderId;
                            });
                    },
                    onApprove: (data: any) => {
                        return fetch("/api/paypal/capture-order", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ orderId: data.orderID }),
                        })
                            .then((res) => res.json())
                            .then((details) => {
                                console.log("Pagamento completato:", details);
                                alert("Pagamento completato!");
                            });
                    },
                    onError: (err: any) => {
                        console.error("PayPal SDK error", err);
                        setErrMsg("Errore PayPal SDK: " + (err?.message || JSON.stringify(err)));
                        setStatus("error");
                    },
                }).render(paypalRef.current);

                setStatus("ready");
            } catch (err: any) {
                console.error("Errore montaggio PayPal Buttons", err);
                setErrMsg("Errore montaggio PayPal Buttons: " + (err?.message || JSON.stringify(err)));
                setStatus("error");
            }
        };

        type ScriptWithReadyState = HTMLScriptElement & {
            readyState?: string;
        };
        const scriptEl = script as ScriptWithReadyState;
        if (
            script.getAttribute("data-loaded") === "true" ||
            scriptEl.readyState === "complete"
        ) {
            onLoad();
        }
        else {
            script.addEventListener("load", () => {
                script.setAttribute("data-loaded", "true");
                onLoad();
            });
            script.addEventListener("error", (ev) => {
                setErrMsg("Impossibile caricare lo script PayPal.");
                setStatus("error");
                console.error("PayPal script load error", ev);
            });
        }

        return () => {
            container.innerHTML = "";
        };
    }, []);

    return (
        <div>
            <h2>Paga con PayPal</h2>
            <div style={{ minHeight: 80 }}>
                {status === "loading" && <div>Caricamento PayPal...</div>}
                {status === "ready" && <div>PayPal pronto — puoi pagare:</div>}
                {status === "error" && <div style={{ color: "crimson" }}>Errore: {errMsg}</div>}
            </div>
            <div ref={paypalRef} />
        </div>
    );
};

export default PayPal;
