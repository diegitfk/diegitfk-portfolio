import { PostgreSQL, MySQL , Supabase , MongoDB } from "@ridemountainpig/svgl-react"
import { Python, JavaScript, TypeScript } from "@ridemountainpig/svgl-react"
import { ReactLight, Nextjs, TailwindCSS } from "@ridemountainpig/svgl-react"
import { Hono , FastAPI , Django , ExpressjsLight , ElysiaJS } from "@ridemountainpig/svgl-react"
import { Docker , Git , GitHubLight} from "@ridemountainpig/svgl-react"
import Image from "next/image"

const DatabaseTech = [
    {
        name: "PostgreSQL",
        icon: <PostgreSQL />
    },
    {
        name: "MySQL",
        icon: <MySQL />
    },
    {
        name: "Supabase",
        icon: <Supabase />
    },
    {
        name: "MongoDB",
        icon: <MongoDB />
    }
]

const LanguagesTech = [
    {
        name: "Python",
        icon: <Python />
    },
    {
        name: "JavaScript",
        icon: <JavaScript />
    },
    {
        name: "TypeScript",
        icon: <TypeScript />
    }
]

const FrontendTech = [
    {
        name: "React",
        icon: <ReactLight />
    },
    {
        name: "Next.js",
        icon: <Nextjs />
    },
    {
        name: "Tailwind CSS",
        icon: <TailwindCSS />
    }
]

const BackendTech = [
    {
        name: "Hono",
        icon: <Hono />
    },
    {
        name: "FastAPI",
        icon: <FastAPI />
    },
    {
        name: "Django",
        icon: <Django />
    },
    {
        name: "Express.js",
        icon: <ExpressjsLight />
    },
    {
        name: "ElysiaJS",
        icon: <ElysiaJS />
    }
]
const DevOpsTech = [
    {
        name: "Docker",
        icon: <Docker />
    },
    {
        name: "Git",
        icon: <Git />
    },
    {
        name: "GitHub",
        icon: <GitHubLight />
    }
]

const AITech = [
    {
        name: "LangChain",
        icon: <Image src="/icons/langchain.svg" alt="LangChain" width={80} height={80} className="size-full bg-white p-2" />
    },
    {
        name: "Agno",
        icon: <Image src="/icons/agno.png" alt="Agno" width={80} height={80} className="size-full bg-white" />
    },
    {
        name : "AISdk",
        icon : <Image src="/icons/ai-sdk.png" alt="AISdk" width={80} height={80} className="size-full bg-white" />
    }
]

const _HorizontalSliderArgs = {
    databaseSlide : {
        title: "Bases de Datos",
        data: DatabaseTech
    },
    languagesSlide : {
        title: "Lenguajes",
        data: LanguagesTech
    },
    frontendSlide : {
        title: "Frontend",
        data: FrontendTech
    },
    backendSlide : {
        title: "Backend",
        data: BackendTech
    }
}

export function TechScrollSlider() {
    const allTech = [
        ...DatabaseTech,
        ...LanguagesTech,
        ...FrontendTech,
        ...BackendTech,
        ...DevOpsTech,
        ...AITech
    ]

    return (
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
                {allTech.map((tech, index) => (
                    <li key={`${tech.name}-${index}`}>
                        <div className="flex flex-col items-center justify-center text-white">
                            <div className="size-20 [&>svg]:size-full [&>svg]:fill-current">
                                {tech.icon}
                            </div>
                            <span className="mt-2 text-sm font-medium">{tech.name}</span>
                        </div>
                    </li>
                ))}
            </ul>
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true">
                {allTech.map((tech, index) => (
                    <li key={`${tech.name}-${index}-duplicate`}>
                        <div className="flex flex-col items-center justify-center text-white">
                            <div className="size-20 [&>svg]:size-full [&>svg]:fill-current">
                                {tech.icon}
                            </div>
                            <span className="mt-2 text-sm font-medium">{tech.name}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
