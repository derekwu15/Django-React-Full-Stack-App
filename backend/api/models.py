from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes") #links user with data that belongs to user in this case collection of notes
    #FOREIGN KEYS IMPORTANT -- Cascade will delete all, related name will allow access via .notes for user
    def __str__(self):
        return self.title