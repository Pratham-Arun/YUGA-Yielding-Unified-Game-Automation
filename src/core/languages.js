// Define supported languages and their features
export const SUPPORTED_LANGUAGES = {
  csharp: {
    name: 'C#',
    fileExtension: '.cs',
    templates: {
      component: 'using UnityEngine;\n\npublic class {name} : MonoBehaviour\n{\n    void Start()\n    {\n        {initialization}\n    }\n\n    void Update()\n    {\n        {update}\n    }\n}',
      scriptableObject: 'using UnityEngine;\n\n[CreateAssetMenu(fileName = "{name}", menuName = "ScriptableObjects/{name}")]\npublic class {name}Data : ScriptableObject\n{\n    {properties}\n}',
      interface: 'public interface I{name}\n{\n    {methods}\n}'
    }
  },
  javascript: {
    name: 'JavaScript',
    fileExtension: '.js',
    templates: {
      class: 'class {name} {\n    constructor() {\n        {initialization}\n    }\n\n    {methods}\n}',
      module: 'export const {name} = {\n    {properties}\n};',
      component: 'export function {name}({ props }) {\n    {implementation}\n}'
    }
  },
  python: {
    name: 'Python',
    fileExtension: '.py',
    templates: {
      class: 'class {name}:\n    def __init__(self):\n        {initialization}\n\n    {methods}',
      dataclass: 'from dataclasses import dataclass\n\n@dataclass\nclass {name}:\n    {properties}',
      script: '#!/usr/bin/env python3\n\ndef main():\n    {implementation}\n\nif __name__ == "__main__":\n    main()'
    }
  },
  lua: {
    name: 'Lua',
    fileExtension: '.lua',
    templates: {
      module: 'local {name} = {{}}\n\nfunction {name}:new(o)\n    o = o or {{}}\n    setmetatable(o, self)\n    self.__index = self\n    return o\nend\n\n{methods}\n\nreturn {name}',
      script: 'local {name} = {{}}\n\nfunction {name}.start()\n    {initialization}\nend\n\nfunction {name}.update(dt)\n    {update}\nend\n\nreturn {name}'
    }
  }
};