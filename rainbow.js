function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}
var options = {
    SELF: [
        {name: "Box", sub: "ESP"},
        {name: "Glow", sub: "ESP"},
        {name: "Name", sub: "ESP"},
        {name: "Health", sub: "ESP", alias: "Health color override"},
        {name: "Ammo", sub: "ESP"},
        {name: "Shot Timer", sub: "ESP", alias: "Shot timer"},
        {name: "Taser Range", sub: "ESP", alias: "Taser range"},
        {name: "Knife Range", sub: "ESP", alias: "Knife range"},
        {name: "Weapon Spread", sub: "ESP", alias: "Weapon spread"},
        {name: "Chams - Visible", sub: "Chams", alias: "Visible Color"},
        {name: "Chams - Attachments", sub: "Chams", alias: "Attachment Color"},
        {name: "Chams - Desync", sub: "Chams", alias: "Desync Color"},
        {name: "Chams - Fake Lag", sub: "Chams", alias: "Fakelag Color"},
        {name: "Chams - Arms", sub: "Chams", alias: "Arms Color"},
        {name: "Chams - Weapon", sub: "Chams", alias: "Weapon Color"}
    ],
    ENEMIES: [
        {name: "Box", sub: "ESP"},
        {name: "Glow", sub: "ESP"},
        {name: "Name", sub: "ESP"},
        {name: "Health", sub: "ESP", alias: "Health color override"},
        {name: "Ammo", sub: "ESP"},
        {name: "Skeleton", sub: "ESP"},
        {name: "OFOV Arrows", sub: "HUD", alias: "Out of fov"},
        {name: "Footsteps", sub: "HUD"},
        {name: "Chams - Visible", sub: "Chams", alias: "Visible Color"},
        {name: "Chams - XQZ", sub: "Chams", alias: "Hidden Color"},
        {name: "Chams - Attachments", sub: "Chams", alias: "Attachment Color"},
        {name: "Chams - History", sub: "Chams", alias: "History Color"}
    ],
    FRIENDLIES: [
        {name: "Box", sub: "ESP"},
        {name: "Glow", sub: "ESP"},
        {name: "Name", sub: "ESP"},
        {name: "Health", sub: "ESP", alias: "Health color override"},
        {name: "Ammo", sub: "ESP"},
        {name: "Skeleton", sub: "ESP"},
        {name: "Chams - Visible", sub: "Chams", alias: "Visible Color"},
        {name: "Chams - XQZ", sub: "Chams", alias: "Hidden Color"},
        {name: "Chams - Attachments", sub: "Chams", alias: "Attachment Color"}
    ],
    WORLD: [
        {name: "Bomb", sub: "Entities"},
        {name: "Hostage", sub: "Entities"},
        {name: "Grenades", sub: "Entities"},
        {name: "Weapons", sub: "Entities"},
        {name: "Bullet Impacts - Client", sub: "Entities", alias: "Bullet impacts (client)"},
        {name: "Bullet Impacts - Server", sub: "Entities", alias: "Bullet impacts (server)"},
        {name: "Bullet Traces", sub: "Entities", alias: "Bullet tracers"},
    ]
}, colors = {};
function setupTables() {
    for (var category in options) {
        colors[category] = {length: options[category].length};
        var selection = [];
        var i = 0;
        for (var option in options[category]) {
            var o = options[category][option];
            selection.push(o.name);
            colors[category][i > 0 ? Math.pow(2, i) : 1] = {name: o.name, sub: o.sub, alias: o.alias, color: UI.GetColor("Visual", category, o.sub, o.alias ? o.alias : o.name), enabled: false};
            i++;
        }
        UI.AddMultiDropdown("RGB Visuals - " + category, selection);
    }
}
function resolveMultiDropdown() {
    for (category in colors) {
        var selected = UI.GetValue("Misc", "JAVASCRIPT", "Script items", "RGB Visuals - " + category);
        for (option in colors[category]) 
            colors[category][option].enabled = false;
        for (var i = colors[category].length; i >= 0 && selected > 0; i--) {
            var n = i > 0 ? Math.pow(2, i) : 1;
            if (selected-n >= 0) {
                selected -= n;
                colors[category][n].enabled = true;
            }
        }
    }
}
function draw() {
    resolveMultiDropdown();
    var rgb = HSVtoRGB(Globals.Tickcount() % 350 / 350, 1, 1, 1, 255);
    for (category in colors) {
        for (color in colors[category]) {
            if (color == "length") continue;
            var c = colors[category][color];
            UI.SetColor("Visual", category, c.sub, c.alias ? c.alias : c.name, c.enabled ? [rgb.r, rgb.g, rgb.b, c.color[3]] : c.color);
        }
    }
}
function main() {
    setupTables();
    Cheat.RegisterCallback("Draw", "draw");
    Cheat.Print("Rory's RGB Visuals successfully loaded.");
} main();
