"use client";

import { Card, CardBody, CardHeader, Button, Progress, Chip } from "@nextui-org/react";
import { Github, Twitter, Link as LinkIcon, Star, GitFork } from "lucide-react";
import Link from "next/link";
import { PlanetBanner } from '@/components/planet-banner';

export default function AndrexYTProfile() {
  const githubStats = {
    totalStars: 2,
    totalCommits: 173,
    totalPRs: 5,
    totalIssues: 25,
    contributedLastYear: 24,
    languages: [
      { name: "Java", percentage: 98.93 },
      { name: "HTML", percentage: 1.07 }
    ]
  };

  const repositories = [
    {
      name: "AutoAdvertiser",
      description: "",
      language: "Java",
      stars: 2,
      isPublic: true
    },
    {
      name: "Andreasploit",
      description: "A roblox exploit created by AndrexYoutube!",
      isPublic: true
    },
    {
      name: "ZenithProxy",
      description: "2b2t minecraft proxy",
      forkedFrom: "2b2t/ZenithProxy",
      language: "Java",
      isPublic: true
    }
  ];

  return (
    <div className="max-w-[1024px] mx-auto p-4">
      <Card className="mb-6" shadow="none">
        <CardBody className="p-0">
          <PlanetBanner sceneUrl="https://prod.spline.design/JIqFUulHGLdenrXi/scene.splinecode" />
          <div className="px-6 py-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">AndrexYT</h1>
                <p className="text-default-500 text-sm">Full-stack developer</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  variant="bordered"
                  startContent={<Twitter className="w-4 h-4" />}
                >
                  Twitter
                </Button>
                <Button 
                  size="sm"
                  variant="bordered"
                  startContent={<Github className="w-4 h-4" />}
                >
                  GitHub
                </Button>
              </div>
            </div>

            <div className="flex gap-4 text-default-500 text-sm">
              <span className="flex items-center gap-1">
                <span className="font-semibold text-foreground">6</span> Following
              </span>
              <span className="flex items-center gap-1">
                <span className="font-semibold text-foreground">25</span> Followers
              </span>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card shadow="none" className="border border-default-200">
          <CardHeader className="border-b border-default-200">
            <h3 className="text-lg font-semibold">GitHub Stats</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Stars Earned</span>
                <Chip variant="flat" color="primary">{githubStats.totalStars}</Chip>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Commits (2024)</span>
                <Chip variant="flat" color="primary">{githubStats.totalCommits}</Chip>
              </div>
              <div className="flex justify-between items-center">
                <span>Pull Requests</span>
                <Chip variant="flat" color="primary">{githubStats.totalPRs}</Chip>
              </div>
              <div className="flex justify-between items-center">
                <span>Issues</span>
                <Chip variant="flat" color="primary">{githubStats.totalIssues}</Chip>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card shadow="none" className="border border-default-200">
          <CardHeader>
            <h3 className="text-xl font-semibold">Most Used Languages</h3>
          </CardHeader>
          <CardBody>
            {githubStats.languages.map((lang) => (
              <div key={lang.name} className="mb-4">
                <div className="flex justify-between mb-2">
                  <span>{lang.name}</span>
                  <span>{lang.percentage}%</span>
                </div>
                <Progress 
                  value={lang.percentage} 
                  color="primary"
                  size="sm"
                  radius="sm"
                />
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <Card shadow="none" className="border border-default-200">
        <CardHeader className="border-b border-default-200">
          <h3 className="text-lg font-semibold">Popular Repositories</h3>
        </CardHeader>
        <CardBody>
          <div className="divide-y divide-default-200">
            {repositories.map((repo) => (
              <div key={repo.name} className="py-4 first:pt-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-blue-500 hover:underline cursor-pointer">
                      {repo.name}
                    </h4>
                    {repo.description && (
                      <p className="text-default-500 text-sm mt-1">{repo.description}</p>
                    )}
                  </div>
                  {repo.isPublic && (
                    <Chip size="sm" variant="flat" color="success">Public</Chip>
                  )}
                </div>
                <div className="flex gap-3 mt-3">
                  {repo.language && (
                    <Chip 
                      size="sm" 
                      variant="flat" 
                      color="default"
                    >
                      {repo.language}
                    </Chip>
                  )}
                  {repo.stars && (
                    <Chip 
                      size="sm" 
                      variant="flat" 
                      color="warning"
                      startContent={<Star className="w-3 h-3" />}
                    >
                      {repo.stars}
                    </Chip>
                  )}
                </div>
                {repo.forkedFrom && (
                  <div className="mt-2 flex items-center gap-1 text-default-400">
                    <GitFork className="w-3 h-3" />
                    <span className="text-sm">Forked from {repo.forkedFrom}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
} 