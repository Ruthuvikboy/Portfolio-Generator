'use client';

import {useEffect, useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {useRouter} from 'next/navigation';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import {Icons} from '@/components/icons';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';
import jsPDF from 'jspdf';

const PortfolioPage = () => {
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem('portfolioData');
    if (data) {
      setPortfolioData(JSON.parse(data));
    } else {
      router.push('/');
    }
  }, [router]);

  if (!portfolioData) {
    return <div>Loading...</div>;
  }

  const {name, age, occupation, contactInformation, shortBio, skills, projects, photo} = portfolioData;

  const downloadPdf = () => {
    const doc = new jsPDF();

    // Set font and color
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(31, 115, 183);

    // Add name in larger font size
    doc.setFontSize(32);
    doc.text(name, 14, 20);

    // Reset font size and color
    doc.setFontSize(12);
    doc.setTextColor(31, 115, 183);
    doc.text(occupation, 14, 28);
    doc.text(`Age: ${age}`, 14, 34);
    doc.text(`Contact: ${contactInformation}`, 14, 40);

    // Add "About Me" section
    doc.setFontSize(16);
    doc.text('About Me', 14, 50);
    doc.setFontSize(12);
    doc.text(shortBio, 14, 56, {maxWidth: 180});

    // Add "Skills" section
    doc.setFontSize(16);
    doc.text('Skills', 14, 80);
    doc.setFontSize(12);
    const skillsText = skills.join(', ');
    doc.text(skillsText, 14, 86, {maxWidth: 180});

    // Add "Projects" section
    doc.setFontSize(16);
    doc.text('Projects', 14, 100);
    let y = 106;
    projects.forEach((project: any) => {
      doc.setFontSize(14);
      doc.text(project.name, 14, y);
      doc.setFontSize(12);
      doc.text(project.description, 14, y + 6, {maxWidth: 180});
      y += 20;
    });

    // Add photo
    if (photo) {
      const img = new Image();
      img.src = photo;
      img.onload = () => {
        doc.addImage(img, 'jpeg', 14, y + 10, 50, 50);
        doc.save(`${name}-portfolio.pdf`);
      };
    } else {
      doc.save(`${name}-portfolio.pdf`);
    }
  };


  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <Card className="bg-card shadow-md rounded-lg overflow-hidden">
          <CardHeader className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-semibold text-foreground">{name}</h1>
                <CardDescription className="text-muted-foreground">{occupation}</CardDescription>
              </div>
              <Avatar className="w-20 h-20">
                {photo && <AvatarImage src={photo} alt={name} />}
                <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <section className="mb-4">
              <h2 className="text-xl font-semibold mb-2 text-foreground">About Me</h2>
              <p className="text-foreground">{shortBio}</p>
            </section>

            <section className="mb-4">
              <h2 className="text-xl font-semibold mb-2 text-foreground">Contact Information</h2>
              <p className="text-foreground">{contactInformation}</p>
            </section>

            <section className="mb-4">
              <h2 className="text-xl font-semibold mb-2 text-foreground">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: string, index: number) => (
                  <span key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">{skill}</span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2 text-foreground">Projects</h2>
              <Accordion type="single" collapsible>
                {projects.map((project: any, index: number) => (
                  <AccordionItem key={index} value={`project-${index}`}>
                    <AccordionTrigger className="text-left text-lg font-medium text-foreground">{project.name}</AccordionTrigger>
                    <AccordionContent className="text-foreground">{project.description}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </CardContent>
        </Card>
        <TooltipProvider>
          <div className="flex justify-center mt-4 gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={() => router.push('/')}>
                  <Icons.edit className="w-4 h-4 mr-2" /> Edit Details
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Click here to edit your portfolio details
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={downloadPdf}>
                  <Icons.file className="w-4 h-4 mr-2" /> Download PDF
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Download this portfolio as a PDF
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default PortfolioPage;
