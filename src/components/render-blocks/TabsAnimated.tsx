'use client'

import Image from 'next/image'
import { Tabs } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { AnimatedTabsBlock } from "@/payload-types";

interface TabsAnimatedProps extends AnimatedTabsBlock {}

export const TabsAnimatedComponent: React.FC<TabsAnimatedProps> = ({ tabs }) => {
  // Validar que existan tabs
  if (!tabs || tabs.length === 0) {
    return (
      <div className="my-8 p-4 text-muted-foreground text-center">
        No hay tabs configurados
      </div>
    );
  }

  // Transformar los datos del API al formato esperado por el componente Tabs
  const formattedTabs = tabs.map((tab) => {
    // Obtener la URL de la imagen si existe
    const imageUrl = typeof tab.image === 'object' && tab.image?.url
      ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL || ''}${tab.image.url}`
      : null;

    const imageAlt = typeof tab.image === 'object' && tab.image?.alt
      ? tab.image.alt
      : 'Tab image';

    return {
      title: tab.title || '',
      value: tab.value || '',
      content: (
        <Card className="w-full h-[420px] sm:h-[480px] md:h-[560px] lg:h-[640px] xl:h-[680px] border-2 shadow-lg flex flex-col overflow-hidden">
          <CardHeader className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-2 sm:space-y-3 flex-shrink-0">
            {tab.title && (
              <CardTitle className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-tight">
                {tab.title}
              </CardTitle>
            )}
          </CardHeader>

          {tab.description && (
            <div className="px-3 sm:px-4 md:px-5 lg:px-6 pb-3 sm:pb-4 md:pb-5 lg:pb-6 flex-shrink-0">
              <Separator className="mb-2 sm:mb-3 md:mb-4" />
              <div className="max-h-[100px] sm:max-h-[120px] md:max-h-[140px] overflow-y-auto pr-2 scrollbar-thin">
                <CardDescription className="text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed">
                  {tab.description}
                </CardDescription>
              </div>
            </div>
          )}
          
          {imageUrl && (
            <CardContent className="p-2 sm:p-3 md:p-4 lg:p-5 pt-0 flex-1 flex flex-col justify-center overflow-hidden">
              <Separator className="mb-2 sm:mb-3 md:mb-4 lg:mb-5" />
              <div className="flex items-center justify-center bg-muted/30 rounded-lg p-1 sm:p-2 md:p-3 h-full">
                <div className="relative w-full h-full max-h-full flex items-center justify-center">
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    width={800}
                    height={600}
                    className="object-contain w-full h-full rounded-md"
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ),
    };
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }
          .scrollbar-thin::-webkit-scrollbar-track {
            background: transparent;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: hsl(var(--muted-foreground) / 0.3);
            border-radius: 3px;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: hsl(var(--muted-foreground) / 0.5);
          }
          .scrollbar-thin {
            scrollbar-width: thin;
            scrollbar-color: hsl(var(--muted-foreground) / 0.3) transparent;
          }
        `
      }} />
      <div className="h-auto min-h-[44rem] sm:min-h-[48rem] md:h-[56rem] lg:h-[64rem] xl:h-[68rem] [perspective:1000px] relative flex flex-col max-w-6xl mx-auto w-full px-2 sm:px-4 items-start justify-start mt-8 sm:mt-10 md:mt-12 mb-4 sm:mb-5 md:mb-6">
        <Tabs 
          tabs={formattedTabs} 
          contentClassName="mt-14 sm:mt-16 md:mt-[4.5rem] lg:mt-20 xl:mt-[5.5rem]"
          containerClassName="gap-2 sm:gap-3 relative z-10"
          tabClassName="text-sm sm:text-base relative z-10"
        />
      </div>
    </>
  );
};
