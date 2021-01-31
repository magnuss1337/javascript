var props = false;
var tonemapClass = 'CEnvTonemapController';

function getValue(name) {
  var value = UI.GetValue('Script items', name);

  return value;
}

function getColor(name) {
  var value = UI.GetColor('Misc', 'JAVASCRIPT', 'Script items', name);

  return value;
}

function onRender() {
  if (!Entity.GetLocalPlayer()) {
    return;
  }

  var worldColor = (
    getValue('enable world color modulation')
      ? getColor('world color')
      : [0, 0, 0]
  );

  Convar.SetFloat('mat_ambient_light_r', worldColor[0] / 100);
  Convar.SetFloat('mat_ambient_light_g', worldColor[1] / 100);
  Convar.SetFloat('mat_ambient_light_b', worldColor[2] / 100);

  var entities = Entity.GetEntities();

  for (var i = 0; i < entities.length; i++) {
    var entity = entities[i];
    var name = Entity.GetClassName(entity);

    if (name !== tonemapClass) {
      continue;
    }

    if (!props) {
      Entity.SetProp(entity, tonemapClass, 'm_bUseCustomAutoExposureMin', true);
      Entity.SetProp(entity, tonemapClass, 'm_bUseCustomAutoExposureMax', true);
      Entity.SetProp(entity, tonemapClass, 'm_bUseCustomBloomScale', true);

      props = true;
    }

    if (props) {
      var value = getValue('world exposure') / 10;
      Entity.SetProp(entity, tonemapClass, 'm_flCustomAutoExposureMin', value);
      Entity.SetProp(entity, tonemapClass, 'm_flCustomAutoExposureMax', value);

      Entity.SetProp(entity, tonemapClass, 'm_flCustomBloomScale', getValue('bloom scale') / 10);
    }

    Convar.SetFloat('r_modelAmbientMin', getValue('model ambient') / 10);
  }
}

function init() {
  UI.AddSliderFloat('world exposure', 0.0, 100.0);
  UI.AddSliderFloat('model ambient', 0.0, 100.0);
  UI.AddSliderFloat('bloom scale', 0.0, 100.0);
  UI.AddCheckbox('enable world color modulation');
  UI.AddColorPicker('world color');

  UI.SetValue('Misc', 'GENERAL', 'Hidden cvars', true);
  UI.SetValue('Misc', 'PERFORMANCE & INFORMATION', 'Disable post processing', false);

  Cheat.RegisterCallback("Draw", "onRender");
}

init();
