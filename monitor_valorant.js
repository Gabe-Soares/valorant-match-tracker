const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const notifier = require("node-notifier");
const fs = require("fs");
const path = require("path");

puppeteer.use(StealthPlugin());

const SAVE_FILE = "ultima_data.txt";

const PROFILE_URL = "";

const USER = "";

// Configurando navegador e abrindo site.
async function getLastMatchData() {
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-blink-features=AutomationControlled",
            "--disable-dev-shm-usage",
            "--start-maximized"
        ]
    });

    const page = await browser.newPage();
    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    await page.setViewport({ width: 1400, height: 900 });
    await page.setJavaScriptEnabled(true);

    await page.goto(PROFILE_URL, { waitUntil: "networkidle2", timeout: 120000 });
    await page.waitForSelector(".vmr-info");

    // Pegando última partida.
    const row = await page.$(".trn-match-row");
    if (!row) return null;

    // Pegando data da última partida.
    const rawDate = await row.$eval("[title]", el => el.getAttribute("title"));

    // Iniciando coleta dos parceiros de time.
    let players = [];
    const dateElement = await row.$("[title]");

    if (dateElement) {
        // Abrindo modal da última partida para coletar parceiros de time.
        await dateElement.click();
        await page.waitForSelector("#trn-teleport-backdrop > div", {
            timeout: 120000
        });

        players = await page.evaluate((USER) => {
            const modal = document.querySelector("#trn-teleport-backdrop > div");
            if (!modal) return [];

            const teamTables = [...modal.querySelectorAll(".st-content")];

            // Selecionando time em que o jogador pesquisado está.
            let playerTeam = null;
            for (const table of teamTables) {
                if (table.querySelector(".st-entry-current-player")) {
                    playerTeam = table;
                    break;
                }
            }

            if (!playerTeam) return [];

            const rows = [...playerTeam.querySelectorAll(".st-content__item")];

            return rows
                .map(r => {
                    const username = r.querySelector(".trn-ign__username")?.textContent.trim() || "";
                    const tag = r.querySelector(".trn-ign__discriminator")?.textContent.trim() || "";
                    return `${username}${tag}`;
                });
        });
    }

    // Fechando navegador e conexão.
    await browser.close();

    //Removendo o usuário rastreado da lista.
    players = players.filter(r => r!=USER);

    return {
        rawDate,
        players
    };
}

function parseTrackerDate(raw) {
    return new Date(raw);
}

function loadSavedDate() {
    if (!fs.existsSync(SAVE_FILE)) return null;
    const txt = fs.readFileSync(SAVE_FILE, "utf8").trim();
    return new Date(txt);
}

function saveDate(date) {
    fs.writeFileSync(SAVE_FILE, date.toISOString());
}

function sendNotification(players) {
    // Lógica de retry em caso de lista de players vazia.
    if(!players) {
        notifier.notify({
            title: "[RETRY] Nova partida sem players.",
            message: "Partida encontrada mas sem retorno de parceiros.",
            sound: true
        });
    }
    else {
        notifier.notify({
            title: "Nova partida encontrada!",
            message: "Parceiros: " + players.join(" "),
            sound: true
        });
        
        console.log("\n=== PARCEIROS DE PARTIDA ===");
        players.forEach(p => console.log("- " + p));
    }
}

async function main() {
    console.log("🔍 Verificando últimas partidas...");

    const data = await getLastMatchData();
    if (!data || !data.rawDate) {
        console.log("❌ Não foi possível extrair os dados.");
        return;
    }

    const matchDate = parseTrackerDate(data.rawDate);
    const savedDate = loadSavedDate();

    console.log("📅 Data da partida encontrada:", matchDate);
    console.log("📁 Data salva anteriormente:", savedDate);

    if (!savedDate || matchDate > savedDate) {
        console.log("⚠ Nova partida detectada!");

        if(data.players && data.players.length>0){
            saveDate(matchDate);
            sendNotification(data.players);
        }
        // Lógica de retry em caso de lista de players vazia.
        else {
            sendNotification(null);
        }

    } else {
        console.log("✔ Nenhuma nova partida.");
    }
}

main();