import { useState } from 'react';
import { useCreatePost } from '../../hooks/useQueries';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { PostId } from '../../backend';

const MAX_CHARACTERS = 500;

interface PostComposerProps {
  replyTo?: PostId;
  onSuccess?: () => void;
  placeholder?: string;
}

export default function PostComposer({ replyTo, onSuccess, placeholder }: PostComposerProps) {
  const [content, setContent] = useState('');
  const createPost = useCreatePost();

  const remainingChars = MAX_CHARACTERS - content.length;
  const isValid = content.trim().length > 0 && content.length <= MAX_CHARACTERS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      await createPost.mutateAsync({ content: content.trim(), replyTo });
      setContent('');
      toast.success(replyTo !== undefined ? 'Reply posted!' : 'Post created!');
      onSuccess?.();
    } catch (error) {
      console.error('Post creation error:', error);
      toast.error('Failed to create post');
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            placeholder={placeholder || "What's on your mind?"}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <div className="flex items-center justify-between">
            <span
              className={`text-sm ${
                remainingChars < 0
                  ? 'text-destructive'
                  : remainingChars < 50
                    ? 'text-orange-600'
                    : 'text-muted-foreground'
              }`}
            >
              {remainingChars} characters remaining
            </span>
            <Button type="submit" disabled={!isValid || createPost.isPending}>
              {createPost.isPending ? 'Posting...' : replyTo !== undefined ? 'Reply' : 'Post'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
