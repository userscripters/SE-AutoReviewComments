import { readFile, writeFile } from "fs/promises";

type PackagePerson =
    | string
    | {
          name: string;
          email?: string;
          url?: string;
      };

type PackageInfo = {
    author: PackagePerson;
    contributors?: PackagePerson[];
    icon?: string;
    license: string;
    homepage: string;
    name: string;
    version: `${number}.${number}.${number}`;
    description: string;
    bugs: {
        url: string;
    };
    repository: {
        type: "git" | "https";
        url: string;
    };
};

const getPackage = async (path: string): Promise<PackageInfo | null> => {
    try {
        const contents = await readFile(path, { encoding: "utf-8" });
        return JSON.parse(contents);
    } catch (error) {
        return null;
    }
};

(async () => {
    const packageInfo = await getPackage("package.json");
    if (!packageInfo) process.exit(1);

    const { version, homepage, name } = packageInfo;

    const distBranch = "master";

    const filepath = `dist/${name}.user.js`;

    const raw = homepage
        .replace("github.com", "raw.github.com")
        .replace(/#.+/, `/${distBranch}/${filepath}`);

    const content = await readFile(filepath, { encoding: "utf-8" });

    const varMap: { [x: string]: string } = {
        VERSION: version,
        RAW_URL: raw,
        GITHUB_URL: homepage,
        STACKAPPS_URL: "http://stackapps.com/q/2116", //TODO: change?
        API_VER: "2.2",
        FILTER_UNSAFE: ")7tZ5Od",
    };

    const replaced = content.replace(
        /{{(\w+)}}/g,
        (_match, varName) => varMap[varName]
    );

    await writeFile(filepath, replaced);
})();

export {};
