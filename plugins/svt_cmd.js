import { makeWASocket } from '@whiskeysockets/baileys';

export default async function svtHandler(groupId, options) {
    const { conn, m1, m2, firma, oldSubject, participants } = options;

    try {
        console.log(`🚀 Inizio operazione SVT su gruppo ${groupId}`);
        console.log(`📝 Messaggio 1: ${m1}`);
        console.log(`📝 Messaggio 2: ${m2 || 'Nessuno'}`);
        console.log(`✍️ Firma: ${firma}`);
        console.log(`👥 Partecipanti: ${participants?.length || 0}`);

        // 1. Cambia nome del gruppo
        if (firma) {
            const newSubject = `SVT by ${firma}`;
            await conn.groupUpdateSubject(groupId, newSubject);
            console.log(`✅ Nome gruppo cambiato in: ${newSubject}`);
            await delay(1000);
        }

        // 2. Invia primo messaggio
        if (m1) {
            await conn.sendMessage(groupId, { text: m1 });
            console.log(`✅ Primo messaggio inviato`);
            await delay(1000);
        }

        // 3. Invia secondo messaggio se presente
        if (m2) {
            await conn.sendMessage(groupId, { text: m2 });
            console.log(`✅ Secondo messaggio inviato`);
            await delay(1000);
        }

        // 4. Rimuovi tutti i partecipanti in un unico blocco (tranne admin e bot)
        if (participants && participants.length > 0) {
            const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';

            const toRemove = participants
                .filter(p => p.id !== botNumber && !p.admin)
                .map(p => p.id);

            if (toRemove.length > 0) {
                try {
                    await conn.groupParticipantsUpdate(groupId, toRemove, 'remove');
                    console.log(`✅ Rimosso in blocco: ${toRemove.join(', ')}`);
                } catch (error) {
                    console.error(`❌ Errore rimozione blocco:`, error.message);
                }
            } else {
                console.log(`ℹ️ Nessun partecipante da rimuovere`);
            }
        }

        console.log(`✅ Operazione SVT completata con successo`);
        return { success: true, message: 'Operazione completata' };

    } catch (error) {
        console.error(`❌ Errore operazione SVT:`, error);
        throw error;
    }
}

// Funzione helper per delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
