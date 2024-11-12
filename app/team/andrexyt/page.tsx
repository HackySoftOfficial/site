"use client";

import { Card, CardBody, CardHeader, Button, Progress, Chip, Avatar } from "@nextui-org/react";
import { Github, Twitter, Link as LinkIcon, Star, GitFork } from "lucide-react";
import Link from "next/link";
import { PlanetBanner } from '@/components/planet-banner';
import { useEffect, useState } from "react";
import axios from 'axios';

interface GitHubUser {
  avatar_url: string;
  name: string;
  login: string;
  bio: string;
  followers: number;
  following: number;
  public_repos: number;
}

interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  fork_count: number;
  private: boolean;
  html_url: string;
  fork_url?: string;
}

interface GitHubApiResponse<T> {
  data: T;
  status: number;
}

export default function AndrexYTProfile() {
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const [userResponse, reposResponse] = await Promise.all([
          axios.get<GitHubUser>('https://api.github.com/users/AndrexYT'),
          axios.get<GitHubRepo[]>('https://api.github.com/users/AndrexYT/repos')
        ]);
        
        setUserData(userResponse.data);
        setRepos(reposResponse.data);
      } catch (error) {
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : 'An unknown error occurred';
        console.error('Error fetching GitHub data:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  useEffect(() => {
    const audioElements = document.getElementsByTagName('audio');
    Array.from(audioElements).forEach(audio => {
      audio.muted = true;
    });

    if (typeof window !== 'undefined' && window.AudioContext) {
      const audioContext = new AudioContext();
      audioContext.suspend();
    }
  }, []);

  if (loading) {
    return (
      <div className="max-w-[1024px] mx-auto p-4">
        <Card className="mb-6">
          <CardBody>
            <div className="flex items-center justify-center h-40">
              Loading profile data...
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1024px] mx-auto p-4">
        <Card className="mb-6">
          <CardBody>
            <div className="flex items-center justify-center h-40 text-red-500">
              Error: {error}
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-[1024px] mx-auto p-4">
      <Card className="mb-6" shadow="none">
        <CardBody className="p-0">
          <PlanetBanner 
            sceneUrl="https://prod.spline.design/H4Ybf7gITNLjr7LA/scene.splinecode" 
            muted={true} 
          />
          <div className="px-6 py-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4 items-center">
                <Avatar
                  src={userData?.avatar_url}
                  className="h-20 w-20"
                  imgProps={{
                    className: "object-cover",
                    alt: `${userData?.login || 'User'}'s avatar`
                  }}
                />
                <div>
                  <h1 className="text-2xl font-bold mb-1">{userData?.login || 'AndrexYT'}</h1>
                  <p className="text-default-500 text-sm">Full-stack developer</p>
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-default-600">{userData?.following ?? 0}</span>
                      <span className="text-small text-default-500">Following</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-default-600">{userData?.followers ?? 0}</span>
                      <span className="text-small text-default-500">Followers</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  variant="bordered"
                  startContent={<Twitter className="w-4 h-4" />}
                >
                  Twitter
                </Button>
                <Link href={`https://github.com/${userData?.login ?? 'AndrexYT'}`} target="_blank" rel="noopener noreferrer">
                  <Button 
                    size="sm"
                    variant="bordered"
                    startContent={<Github className="w-4 h-4" />}
                  >
                    GitHub
                  </Button>
                </Link>
              </div>
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
                <span>Public Repositories</span>
                <Chip variant="flat" color="primary">{userData?.public_repos ?? 0}</Chip>
              </div>
              <div className="flex justify-between items-center">
                <span>Followers</span>
                <Chip variant="flat" color="primary">{userData?.followers ?? 0}</Chip>
              </div>
              <div className="flex justify-between items-center">
                <span>Following</span>
                <Chip variant="flat" color="primary">{userData?.following ?? 0}</Chip>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card shadow="none" className="border border-default-200">
          <CardHeader>
            <h3 className="text-xl font-semibold">Repositories</h3>
          </CardHeader>
          <CardBody>
            <div className="divide-y divide-default-200">
              {repos.slice(0, 3).map((repo) => (
                <div key={repo.name} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link href={repo.html_url} target="_blank" rel="noopener noreferrer">
                        <h4 className="font-semibold text-blue-500 hover:underline cursor-pointer">
                          {repo.name}
                        </h4>
                      </Link>
                      {repo.description && (
                        <p className="text-default-500 text-sm mt-1">{repo.description}</p>
                      )}
                    </div>
                    {!repo.private && (
                      <Chip size="sm" variant="flat" color="success">Public</Chip>
                    )}
                  </div>
                  <div className="flex gap-3 mt-3">
                    {repo.language && (
                      <Chip size="sm" variant="flat" color="default">
                        {repo.language}
                      </Chip>
                    )}
                    {repo.stargazers_count > 0 && (
                      <Chip 
                        size="sm" 
                        variant="flat" 
                        color="warning"
                        startContent={<Star className="w-3 h-3" />}
                      >
                        {repo.stargazers_count}
                      </Chip>
                    )}
                  </div>
                  {repo.fork && (
                    <div className="mt-2 flex items-center gap-1 text-default-400">
                      <GitFork className="w-3 h-3" />
                      <span className="text-sm">Forked repository</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}