import React from "react";
import { Label } from "./ui/shadcn/label";
import { Button } from "./ui/shadcn/button";

type Props = {};

export default function Profile({}: Props) {
  return (
    <div>
      <Label>Link Spotify</Label>
      <Button>Connect</Button>
    </div>
  );
}
